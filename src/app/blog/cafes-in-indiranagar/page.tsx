import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Cafes in Indiranagar Bangalore — Where Locals Actually Go",
  description:
    "Skip the chains. Here are the best cafes in Indiranagar, Bangalore — for slow mornings, work sessions, and late-night conversations.",
};

export default function CafesInIndiranagar() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Best Cafes in Indiranagar Bangalore — Where Locals Actually Go
      </h1>

      <p style={{ color: "#666", marginBottom: "2rem" }}>Last updated: March 2026</p>

      <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "2rem" }}>
        Indiranagar has quietly become one of the best neighbourhoods in India
        for cafes — and not just for the Instagram crowd. The stretch between
        100 Feet Road and 12th Main has everything: specialty roasters where the
        barista talks about single-origin beans like a sommelier, hole-in-the-wall
        places where regulars have had the same corner table for years, and
        everything in between. Here&apos;s what&apos;s actually worth your time.
      </p>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1rem" }}>
        Cafes in Indiranagar Worth Visiting
      </h2>

      <ol style={{ paddingLeft: "1.25rem", lineHeight: "1.9" }}>
        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Matteo Coffea</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; 100 Feet Road, Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            The cafe that started Bangalore&apos;s third-wave coffee obsession.
            Matteo sources micro-lot beans from across India and roasts
            in-house. Their cold brew is legendary — made in small batches and
            often sells out by noon on weekends. The space is no-frills, the
            coffee is anything but.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Corridor Seven Coffee Roasters</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; 12th Main, Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            A serious roastery that also happens to be a great place to sit and
            work. The pour-overs here take about five minutes each — which tells
            you everything about the approach. Order the Ethiopian natural process
            if it&apos;s on the menu. Minimal decor, no background music, strong
            wifi. The regulars are a mix of designers, founders, and writers.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>The Hole in the Wall Cafe</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; 1st Cross, Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            One of the oldest cafes in the neighbourhood and still doing it right.
            The name is apt — it&apos;s a tiny space, and tables fill up fast. The
            all-day breakfast menu is the reason to come: the eggs benedict and
            banana pancakes are perennial bestsellers. Cash only, no reservations,
            arrive before 10 AM on weekends.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Dialogues Cafe</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; 100 Feet Road, Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            More than a cafe — Dialogues hosts live music nights, open mics, and
            art exhibitions alongside good food and coffee. The concept is social
            by design: shared tables, no individual screens encouraged, and a
            community board where people post events. Great for evenings when
            you want something slightly more alive than a laptop and headphones.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Nagarjuna (for the pre-cafe ritual)</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Residency Road, near Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            Not a cafe — but a Bangalorean tradition that deserves a mention. If
            you&apos;re heading to Indiranagar on a weekend morning, stop at
            Nagarjuna for ghee-drenched meals first. It puts any brunch menu to
            shame and reminds you that Bangalore&apos;s food identity runs much
            deeper than flat whites.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>The Brik Oven</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; 80 Feet Road, Indiranagar</span>
          <p style={{ marginTop: "0.25rem" }}>
            Part bakery, part cafe, full neighbourhood institution. The croissants
            here are made from scratch each morning and gone by 11 AM. The space
            is warm and unhurried — exposed brick walls, natural light, and staff
            who actually know regulars by name. Come for the pastries, stay for
            the cortado.
          </p>
        </li>
      </ol>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: "2rem 0 1rem" }}>
        How to Do Indiranagar Cafes Right
      </h2>

      <p style={{ lineHeight: "1.8", marginBottom: "1rem" }}>
        The neighbourhood is compact enough to walk between most of these spots.
        Start at Matteo or Corridor Seven for your morning coffee, then drift
        toward 100 Feet Road as the day opens up. Weekday mornings are a
        completely different experience from Saturday afternoons — quieter, more
        focused, and frankly better for the coffee.
      </p>

      <p style={{ lineHeight: "1.8" }}>
        New cafes open in Indiranagar constantly. We update this list when
        something genuinely earns its place — not just because it&apos;s new.
      </p>
    </main>
  );
}
