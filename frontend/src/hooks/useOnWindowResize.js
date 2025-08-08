// useOnWindowResize hook for Tremor components
import { useEffect, useRef } from "react"

export const useOnWindowResize = (handler) => {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const handleResize = () => {
      if (handlerRef.current) {
        handlerRef.current()
      }
    }

    window.addEventListener("resize", handleResize)
    
    // Call handler on mount to set initial size
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
}