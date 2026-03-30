import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Morning Spots in Bangalore for Early Risers",
  description:
    "The best morning spots in Bangalore — from sunrise hilltops to old-school breakfast joints — for people who actually use the early hours.",
};

export default function BangaloreMorningSpots() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Best Morning Spots in Bangalore for Early Risers
      </h1>

      <p style={{ color: "#666", marginBottom: "2rem" }}>Last updated: March 2026</p>

      <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "2rem" }}>
        Bangalore before 8 AM is a different city. The air is cooler than it
        has any right to be for a metro of 13 million people, the roads are
        navigable, and the old parts of the city quietly do what they&apos;ve
        always done: serve breakfast that&apos;s been perfected over decades,
        keep parks open for the joggers and the chess players and the people
        who just need an hour of quiet. If you&apos;re an early riser, this
        city will reward you for it.
      </p>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1rem" }}>
        Bangalore Morning Spots Worth Waking Up For
      </h2>

      <ol style={{ paddingLeft: "1.25rem", lineHeight: "1.9" }}>
        <li style={{ marginBottom: "1.5rem" }}>
          <strong>CTR (Central Tiffin Room)</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Malleshwaram</span>
          <p style={{ marginTop: "0.25rem" }}>
            If there is a platonic ideal of a Bangalore morning, it involves a
            masala dosa from CTR. This place has been operating since 1920 and
            the dosa batter recipe has not changed. It opens at 7:30 AM, the
            queue starts forming at 7:15. The dosas come out so fast it almost
            seems like a performance. Go hungry, go early, don&apos;t bother
            looking at the menu — just ask for the benne masala dosa.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Cubbon Park, Gate 1</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Kasturba Road, CBD</span>
          <p style={{ marginTop: "0.25rem" }}>
            Enter at Gate 1 on Kasturba Road between 6 and 7 AM and you get
            the park in its best form: the light comes through the trees at a
            low angle, the mist hasn&apos;t fully cleared yet, and the only
            people around are regulars who know what they have. The park has
            over 6,000 trees — including some specimens over 150 years old.
            Walk slowly and look up.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Nandi Hills Viewpoint</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; ~60 km north, Chikballapur district</span>
          <p style={{ marginTop: "0.25rem" }}>
            Yes, it requires leaving by 4:30 AM. Yes, it&apos;s worth it. At
            the top, Nandi Hills sits above a sea of clouds that burns off
            slowly as the sun comes up. The fort ruins at the summit give
            the whole thing an unexpectedly ancient feeling. Bring a jacket —
            it can be 10°C at the viewpoint even when it&apos;s 25°C in
            Bangalore.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Ulsoor Lake Walking Path</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Ulsoor, Central Bangalore</span>
          <p style={{ marginTop: "0.25rem" }}>
            The lake path opens at 5:30 AM and the first hour belongs entirely
            to the serious walkers and the birds. Ulsoor has a healthy resident
            population of painted storks, open-billed storks, and kingfishers.
            The full loop is about 2.5 km. After the walk, the small tea stall
            at the north gate does good cutting chai.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Vidyarthi Bhavan</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Gandhi Bazaar, Basavanagudi</span>
          <p style={{ marginTop: "0.25rem" }}>
            Open only on weekends and only until about noon. The masala dosas
            here are the colour of old copper and arrive in batches — the
            waiter brings them as they come off the griddle, not to order.
            The ghee usage is aggressive and correct. This place has been
            open since 1943. It is always worth the wait.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Bannerghatta Road Sunrise Point</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Bannerghatta, South Bangalore</span>
          <p style={{ marginTop: "0.25rem" }}>
            The stretch of Bannerghatta Road leading toward the national park
            has an underused viewpoint where you can watch the sun come up over
            the Deccan plateau. It&apos;s a working road so you&apos;ll have
            some truck noise, but on weekdays between 6 and 7 AM it&apos;s
            quiet enough. Good for motorcyclists who want a short dawn ride
            with a payoff.
          </p>
        </li>

        <li style={{ marginBottom: "1.5rem" }}>
          <strong>Sankey Tank Morning Circuit</strong>{" "}
          <span style={{ color: "#888" }}>&mdash; Sadashivanagar, North Bangalore</span>
          <p style={{ marginTop: "0.25rem" }}>
            A 1.6 km tank in one of Bangalore&apos;s most pleasant old
            neighbourhoods. The morning circuit is popular with the local
            bungalow residents and the light on the water is especially good
            in winter. Less crowded than Ulsoor, better maintained than most
            other lakes. Bring your binoculars if you have them — egrets and
            herons are regulars.
          </p>
        </li>
      </ol>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: "2rem 0 1rem" }}>
        Why Bangalore Mornings Hit Different
      </h2>

      <p style={{ lineHeight: "1.8", marginBottom: "1rem" }}>
        There&apos;s a version of this city that most people never see because
        they&apos;re asleep for it. The old Bangalore — Malleshwaram, Basavanagudi,
        Rajajinagar — is most itself in the morning. Flower vendors setting up
        on the pavement, the smell of jasmine and ghee, filter coffee in steel
        tumblers, newspapers. It&apos;s not nostalgia, it&apos;s just still
        happening, every day, if you show up early enough.
      </p>

      <p style={{ lineHeight: "1.8" }}>
        Set an alarm. It&apos;s worth it.
      </p>
    </main>
  );
}
