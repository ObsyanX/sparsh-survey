import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Set initial state
    setIsMobile(mql.matches)
    
    // Add event listener with fallback for older browsers
    if ('addEventListener' in mql) {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    } else {
      // Fallback for older browsers
      mql.addListener(onChange)
      return () => mql.removeListener(onChange)
    }
  }, [])

  return !!isMobile
}
