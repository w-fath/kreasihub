import type { ReactNode } from "react";

type CreatorSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function CreatorSection({
  title,
  description,
  children,
}: CreatorSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
