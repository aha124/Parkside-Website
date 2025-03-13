import { SectionProps } from "@/types";
import { cn } from "@/lib/utils";

export function Section({
  title,
  subtitle,
  children,
  className,
  ...props
}: SectionProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 md:py-16 lg:py-20", className)}
      {...props}
    >
      {(title || subtitle) && (
        <div className="space-y-4 text-center mb-10 md:mb-14">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
} 