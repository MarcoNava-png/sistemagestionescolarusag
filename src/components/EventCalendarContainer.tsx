// NO pongas "use client" aquí: debe ser Server Component
import EventCalendar from "./EventCalendar"; // o tu ruta real

type SP = { [keys: string]: string | undefined };

export default async function EventCalendarContainer({
  searchParams,
}: {
  // acepta objeto o promesa (Next 15 lo puede pasar thenable)
  searchParams: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams);
  const { date } = sp ?? {};

  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
    </div>
  );
}
