import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * LazyImage — a drop-in <img> replacement with:
 *  - native lazy loading  (`loading="lazy"` + `decoding="async"`)
 *  - an animate-pulse skeleton shown while the image loads
 *  - graceful fade-in on load (no layout shift — width/height are required)
 *
 * Usage:
 *   <LazyImage src="..." alt="..." width={800} height={600} className="..." />
 */
type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Width in px — required to avoid CLS. */
  width: number;
  /** Height in px — required to avoid CLS. */
  height: number;
  /** Extra classes for the <img> element. */
  className?: string;
  /** Extra classes for the skeleton/wrapper div. */
  wrapperClassName?: string;
};

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle the case where the browser already cached the image and `onLoad`
  // never fires (complete === true immediately after mount).
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Skeleton — visible until the image finishes loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-muted rounded-inherit" />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
