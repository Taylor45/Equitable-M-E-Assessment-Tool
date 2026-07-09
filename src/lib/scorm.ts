/**
 * SCORM Integration Manager for Equitable M&E Reflection Tool
 * Supports both SCORM 1.2 and SCORM 2004 APIs
 */

let scormAPI: any = null;
let scormVersion: '1.2' | '2004' | null = null;
let isInitialized = false;

// Search for the SCORM API in the window hierarchy
function findAPI(win: any): any {
  let attempts = 0;
  while (win != null && attempts < 10) {
    if (win.API) {
      scormVersion = '1.2';
      return win.API;
    }
    if (win.API_1484_11) {
      scormVersion = '2004';
      return win.API_1484_11;
    }
    if (win.parent && win.parent !== win) {
      win = win.parent;
    } else if (win.opener) {
      win = win.opener;
    } else {
      break;
    }
    attempts++;
  }
  return null;
}

// Retrieve the SCORM API instance
export function getSCORMAPI(): any {
  if (scormAPI) return scormAPI;

  scormAPI = findAPI(window);
  if (!scormAPI && window.parent && window.parent !== window) {
    scormAPI = findAPI(window.parent);
  }
  if (!scormAPI && window.top && window.top !== window) {
    scormAPI = findAPI(window.top);
  }
  if (!scormAPI && window.opener) {
    scormAPI = findAPI(window.opener);
  }

  return scormAPI;
}

/**
 * Initializes communication with the LMS SCORM API
 */
export function initSCORM(): boolean {
  if (isInitialized) return true;

  const api = getSCORMAPI();
  if (!api) {
    console.log('[SCORM] No LMS API found. Operating in local-only mode.');
    return false;
  }

  try {
    let result = false;
    if (scormVersion === '1.2') {
      result = api.LMSInitialize("") === "true";
    } else if (scormVersion === '2004') {
      result = api.Initialize("") === "true";
    }

    if (result) {
      isInitialized = true;
      console.log(`[SCORM] Successfully initialized SCORM ${scormVersion} connection.`);
      
      // If status is not completed, set to incomplete
      const currentStatus = getSCORMValue(
        scormVersion === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status'
      );
      if (currentStatus === 'not attempted' || currentStatus === 'unknown' || !currentStatus) {
        setSCORMValue(
          scormVersion === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status',
          'incomplete'
        );
        commitSCORM();
      }
    } else {
      console.error('[SCORM] LMS initialization failed.');
    }
    return result;
  } catch (err) {
    console.error('[SCORM] Exception during LMS Initialize:', err);
    return false;
  }
}

/**
 * Retrieves a value from the SCORM API
 */
export function getSCORMValue(element: string): string {
  const api = getSCORMAPI();
  if (!api || !isInitialized) return '';

  try {
    if (scormVersion === '1.2') {
      return api.LMSGetValue(element);
    } else if (scormVersion === '2004') {
      return api.GetValue(element);
    }
  } catch (err) {
    console.error(`[SCORM] Error getting value for ${element}:`, err);
  }
  return '';
}

/**
 * Sets a value in the SCORM API
 */
export function setSCORMValue(element: string, value: string): boolean {
  const api = getSCORMAPI();
  if (!api || !isInitialized) return false;

  try {
    let result = false;
    if (scormVersion === '1.2') {
      result = api.LMSSetValue(element, value) === "true";
    } else if (scormVersion === '2004') {
      result = api.SetValue(element, value) === "true";
    }
    return result;
  } catch (err) {
    console.error(`[SCORM] Error setting value ${element} = ${value}:`, err);
    return false;
  }
}

/**
 * Commits pending changes to the LMS
 */
export function commitSCORM(): boolean {
  const api = getSCORMAPI();
  if (!api || !isInitialized) return false;

  try {
    if (scormVersion === '1.2') {
      return api.LMSCommit("") === "true";
    } else if (scormVersion === '2004') {
      return api.Commit("") === "true";
    }
  } catch (err) {
    console.error('[SCORM] Error during LMS Commit:', err);
  }
  return false;
}

/**
 * Terminates the SCORM connection
 */
export function terminateSCORM(): boolean {
  if (!isInitialized) return false;

  const api = getSCORMAPI();
  if (!api) return false;

  try {
    let result = false;
    if (scormVersion === '1.2') {
      result = api.LMSFinish("") === "true";
    } else if (scormVersion === '2004') {
      result = api.Terminate("") === "true";
    }
    isInitialized = false;
    console.log('[SCORM] Connection terminated.');
    return result;
  } catch (err) {
    console.error('[SCORM] Error during LMS Terminate:', err);
    return false;
  }
}

/**
 * Get saved answers state from LMS cmi.suspend_data
 */
export function getSavedAnswersFromSCORM(): Record<number, string> | null {
  const data = getSCORMValue('cmi.suspend_data');
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (e) {
    console.error('[SCORM] Failed to parse suspend_data:', e);
  }
  return null;
}

/**
 * Save current answers state to LMS cmi.suspend_data
 */
export function saveAnswersToSCORM(answers: Record<number, string>): boolean {
  const dataStr = JSON.stringify(answers);
  const success = setSCORMValue('cmi.suspend_data', dataStr);
  if (success) {
    commitSCORM();
  }
  return success;
}

/**
 * Report final score and mark the course completed
 * @param scorePercent Score out of 100 (e.g. calculated average maturity level score)
 */
export function reportCompletion(scorePercent: number): void {
  const roundedScore = Math.round(scorePercent);
  
  if (scormVersion === '1.2') {
    setSCORMValue('cmi.core.score.raw', roundedScore.toString());
    setSCORMValue('cmi.core.score.min', '0');
    setSCORMValue('cmi.core.score.max', '100');
    setSCORMValue('cmi.core.lesson_status', 'completed');
  } else if (scormVersion === '2004') {
    setSCORMValue('cmi.score.raw', roundedScore.toString());
    setSCORMValue('cmi.score.min', '0');
    setSCORMValue('cmi.score.max', '100');
    setSCORMValue('cmi.score.scaled', (roundedScore / 100).toString());
    setSCORMValue('cmi.completion_status', 'completed');
    setSCORMValue('cmi.success_status', 'passed');
  }
  
  commitSCORM();
  console.log(`[SCORM] Reported completion with score ${roundedScore}%`);
}

/**
 * Returns whether a SCORM API connection is active
 */
export function isSCORMActive(): boolean {
  return isInitialized && !!getSCORMAPI();
}

/**
 * Returns the detected SCORM Version
 */
export function getSCORMVersion(): '1.2' | '2004' | null {
  return scormVersion;
}
