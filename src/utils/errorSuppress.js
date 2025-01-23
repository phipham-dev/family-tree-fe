// Đặt code này ở đầu file index.js
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalError = Error;

// Ghi đè console.error
console.error = function (...args) {
  if (
    args.some(
      (arg) => String(arg).includes('SVGLength') || (arg instanceof Error && String(arg.stack).includes('SVGLength')),
    )
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Ghi đè console.warn
console.warn = function (...args) {
  if (args.some((arg) => String(arg).includes('SVGLength'))) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Ghi đè Error constructor
window.Error = function (...args) {
  const error = new originalError(...args);
  if (error.message.includes('SVGLength')) {
    return {
      toString: () => '',
      message: '',
      stack: '',
    };
  }
  return error;
};

// Chặn unhandled promise rejections
window.addEventListener(
  'unhandledrejection',
  function (event) {
    if (event.reason && String(event.reason).includes('SVGLength')) {
      event.preventDefault();
    }
  },
  true,
);

// Chặn các error events
window.addEventListener(
  'error',
  function (event) {
    if (event.error && String(event.error).includes('SVGLength')) {
      event.preventDefault();
      return false;
    }
  },
  true,
);
