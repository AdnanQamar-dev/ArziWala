export const PlatformDetect = {
  isMobile: () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  },

  isIOS: () => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  canShare: () => {
    if (typeof navigator === 'undefined') return false;
    return !!navigator.share;
  },

  canPrint: () => {
    if (typeof window === 'undefined') return false;
    // iOS Safari often has issues with window.print() inside iframes or specific contexts, 
    // but generally modern mobile browsers support it. 
    // However, for this app, we prefer PDF download on mobile.
    return !PlatformDetect.isMobile(); 
  }
};