import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// interface TypographyProps extends HTMLAttributes<HTMLElement> {}
type TypographyProps = HTMLAttributes<HTMLElement>;

const H1 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
H1.displayName = "H1";

const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
H2.displayName = "H2";

const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
H3.displayName = "H3";

const H4 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h4>
    );
  }
);
H4.displayName = "H4";

const P = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
P.displayName = "P";

const Blockquote = forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          "mt-6 border-l-2 pl-6 italic text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);
Blockquote.displayName = "Blockquote";

const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xl text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Lead.displayName = "Lead";

export { H1, H2, H3, H4, P, Blockquote, Lead }; 