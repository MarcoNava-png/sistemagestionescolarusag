import * as React from "react";

type Props = React.PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export default function FormContainer({ title, className, children }: Props) {
  return (
    <section className={className ?? "max-w-3xl mx-auto p-4"}>
      {title ? <h2 className="mb-4 text-xl font-semibold">{title}</h2> : null}
      <div className="rounded-md border p-4 bg-white">{children}</div>
    </section>
  );
}
