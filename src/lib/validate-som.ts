export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  stats?: {
    regions: number;
    elements: number;
    interactive: number;
    version: string;
  };
}

const VALID_REGION_ROLES = [
  'main', 'navigation', 'aside', 'header', 'footer',
  'search', 'form', 'dialog', 'section', 'generic', 'content',
] as const;

const VALID_ELEMENT_ROLES = [
  'heading', 'paragraph', 'link', 'button', 'text_input', 'select',
  'checkbox', 'radio', 'textarea', 'image', 'table', 'list', 'listitem',
  'section', 'details', 'generic', 'separator',
] as const;

const VALID_ACTIONS = [
  'click', 'type', 'clear', 'select', 'toggle', 'scroll', 'hover',
] as const;

export function validateSOM(input: string): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. Must be valid JSON
  let doc: unknown;
  try {
    doc = JSON.parse(input);
  } catch {
    return {
      valid: false,
      errors: [{ path: '', message: 'Invalid JSON: ' + (input.trim() === '' ? 'empty input' : 'parse error'), severity: 'error' }],
    };
  }

  // 2. Must be an object
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) {
    return {
      valid: false,
      errors: [{ path: '', message: 'Document must be a JSON object', severity: 'error' }],
    };
  }

  const obj = doc as Record<string, unknown>;

  // 3. som_version
  if (!('som_version' in obj)) {
    errors.push({ path: 'som_version', message: 'Missing required field "som_version"', severity: 'error' });
  } else if (typeof obj.som_version !== 'string') {
    errors.push({ path: 'som_version', message: 'som_version must be a string', severity: 'error' });
  } else if (obj.som_version !== '1.0' && obj.som_version !== '0.1') {
    errors.push({ path: 'som_version', message: `som_version must be "1.0" or "0.1", got "${obj.som_version}"`, severity: 'error' });
  }

  // 4. url
  if (!('url' in obj)) {
    errors.push({ path: 'url', message: 'Missing required field "url"', severity: 'error' });
  } else if (typeof obj.url !== 'string') {
    errors.push({ path: 'url', message: 'url must be a string', severity: 'error' });
  } else if (!obj.url.startsWith('http://') && !obj.url.startsWith('https://')) {
    errors.push({ path: 'url', message: 'url must start with "http://" or "https://"', severity: 'error' });
  }

  // 5. regions
  if (!('regions' in obj)) {
    errors.push({ path: 'regions', message: 'Missing required field "regions"', severity: 'error' });
  } else if (!Array.isArray(obj.regions)) {
    errors.push({ path: 'regions', message: 'regions must be an array', severity: 'error' });
  } else {
    const regions = obj.regions as unknown[];
    if (regions.length === 0) {
      errors.push({ path: 'regions', message: 'regions must have at least 1 region', severity: 'error' });
    }

    let totalElements = 0;
    let interactiveElements = 0;

    regions.forEach((region, ri) => {
      const rPath = `regions[${ri}]`;
      if (region === null || typeof region !== 'object' || Array.isArray(region)) {
        errors.push({ path: rPath, message: 'Region must be an object', severity: 'error' });
        return;
      }

      const r = region as Record<string, unknown>;

      // 6. Region fields
      if (!('id' in r)) {
        errors.push({ path: `${rPath}.id`, message: 'Missing required field "id"', severity: 'error' });
      } else if (typeof r.id !== 'string') {
        errors.push({ path: `${rPath}.id`, message: 'Region ID must be a string', severity: 'error' });
      } else if (!r.id.startsWith('r_')) {
        errors.push({ path: `${rPath}.id`, message: 'Region ID should start with "r_"', severity: 'error' });
      }

      if (!('role' in r)) {
        errors.push({ path: `${rPath}.role`, message: 'Missing required field "role"', severity: 'error' });
      } else if (typeof r.role !== 'string') {
        errors.push({ path: `${rPath}.role`, message: 'Region role must be a string', severity: 'error' });
      } else if (!(VALID_REGION_ROLES as readonly string[]).includes(r.role)) {
        errors.push({ path: `${rPath}.role`, message: `Invalid region role "${r.role}". Must be one of: ${VALID_REGION_ROLES.join(', ')}`, severity: 'error' });
      }

      if (!('elements' in r)) {
        errors.push({ path: `${rPath}.elements`, message: 'Missing required field "elements"', severity: 'error' });
      } else if (!Array.isArray(r.elements)) {
        errors.push({ path: `${rPath}.elements`, message: 'elements must be an array', severity: 'error' });
      } else {
        const elements = r.elements as unknown[];

        // Warning: empty elements
        if (elements.length === 0) {
          errors.push({ path: rPath, message: `Region ${typeof r.id === 'string' ? r.id : ri} has no elements`, severity: 'warning' });
        }

        totalElements += elements.length;

        elements.forEach((element, ei) => {
          const ePath = `${rPath}.elements[${ei}]`;
          if (element === null || typeof element !== 'object' || Array.isArray(element)) {
            errors.push({ path: ePath, message: 'Element must be an object', severity: 'error' });
            return;
          }

          const e = element as Record<string, unknown>;

          // 7. Element fields
          if (!('id' in e)) {
            errors.push({ path: `${ePath}.id`, message: 'Missing required field "id"', severity: 'error' });
          } else if (typeof e.id !== 'string') {
            errors.push({ path: `${ePath}.id`, message: 'Element ID must be a string', severity: 'error' });
          } else if (!e.id.startsWith('e_')) {
            errors.push({ path: `${ePath}.id`, message: 'Element ID must start with "e_"', severity: 'error' });
          }

          if (!('role' in e)) {
            errors.push({ path: `${ePath}.role`, message: 'Missing required field "role"', severity: 'error' });
          } else if (typeof e.role !== 'string') {
            errors.push({ path: `${ePath}.role`, message: 'Element role must be a string', severity: 'error' });
          } else if (!(VALID_ELEMENT_ROLES as readonly string[]).includes(e.role)) {
            errors.push({ path: `${ePath}.role`, message: `Invalid element role "${e.role}". Must be one of: ${VALID_ELEMENT_ROLES.join(', ')}`, severity: 'error' });
          }

          // 8. text
          if ('text' in e && typeof e.text !== 'string') {
            errors.push({ path: `${ePath}.text`, message: 'Element text must be a string', severity: 'error' });
          }

          // 9. attrs
          if ('attrs' in e && (e.attrs === null || typeof e.attrs !== 'object' || Array.isArray(e.attrs))) {
            errors.push({ path: `${ePath}.attrs`, message: 'Element attrs must be an object', severity: 'error' });
          }

          // 10. actions
          if ('actions' in e) {
            if (!Array.isArray(e.actions)) {
              errors.push({ path: `${ePath}.actions`, message: 'Element actions must be an array', severity: 'error' });
            } else {
              (e.actions as unknown[]).forEach((action, ai) => {
                if (typeof action !== 'string') {
                  errors.push({ path: `${ePath}.actions[${ai}]`, message: 'Action must be a string', severity: 'error' });
                } else if (!(VALID_ACTIONS as readonly string[]).includes(action)) {
                  errors.push({ path: `${ePath}.actions[${ai}]`, message: `Invalid action "${action}". Must be one of: ${VALID_ACTIONS.join(', ')}`, severity: 'error' });
                }
              });
              if (Array.isArray(e.actions) && e.actions.length > 0) {
                interactiveElements++;
              }
            }
          }

          // 11. hints
          if ('hints' in e) {
            if (!Array.isArray(e.hints)) {
              errors.push({ path: `${ePath}.hints`, message: 'Element hints must be an array', severity: 'error' });
            } else {
              (e.hints as unknown[]).forEach((hint, hi) => {
                if (typeof hint !== 'string') {
                  errors.push({ path: `${ePath}.hints[${hi}]`, message: 'Hint must be a string', severity: 'error' });
                }
              });
            }
          }
        });
      }
    });

    // Warnings
    if (!('title' in obj)) {
      errors.push({ path: 'title', message: 'Document has no title field', severity: 'warning' });
    }
    if (!('lang' in obj)) {
      errors.push({ path: 'lang', message: 'Document has no lang field', severity: 'warning' });
    }
    if (!('meta' in obj)) {
      errors.push({ path: 'meta', message: 'Document has no meta field (compression stats)', severity: 'warning' });
    }
    if (totalElements > 500) {
      errors.push({ path: 'regions', message: `Large document (${totalElements} elements) may indicate missing summarization`, severity: 'warning' });
    }

    const hasErrors = errors.some((e) => e.severity === 'error');
    return {
      valid: !hasErrors,
      errors,
      stats: !hasErrors
        ? {
            regions: regions.length,
            elements: totalElements,
            interactive: interactiveElements,
            version: typeof obj.som_version === 'string' ? obj.som_version : 'unknown',
          }
        : undefined,
    };
  }

  // If we got here, regions validation was skipped due to error
  return { valid: false, errors };
}
