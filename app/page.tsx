import Speakers from "./components/speakers";
import Hero from "./components/Hero";
import UpcomingEvents from "./components/UpcomingEvents";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Hero
        title="Welcome to RCRB EXPO"
        description="The ultimate platform for innovation, networking, and growth. Join us to shape the future."
      >
        <a href="/register/visitor" className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
          Register as Visitor
        </a>
        <a href="/register/exhibitor" className="text-sm font-semibold leading-6 text-white">
          Book a Stall <span aria-hidden="true">→</span>
        </a>
      </Hero>

      <UpcomingEvents />

      <Speakers />
    </div>
  );
}
