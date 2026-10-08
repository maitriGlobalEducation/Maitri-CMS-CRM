import type { Event } from "@/types/event";

interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

interface EventsResponse {
  success: boolean;
  data: Event[];
  message?: string;
}

export async function getEvents(): Promise<Event[]> {
  const response = await fetch("/api/cms/events");

  const result: EventsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch events");
  }

  return result.data;
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`/api/cms/events/${id}`);

  const result: EventResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch event");
  }

  return result.data;
}
