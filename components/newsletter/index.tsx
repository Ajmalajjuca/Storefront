"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeAction, type NewsletterState } from "./actions";
import styles from "./index.module.css";

const INITIAL_STATE: NewsletterState = { status: "idle" };

const PERKS = [
  "Early access to every drop",
  "Members-only collections",
  "Free entry to exclusive events",
  "Priority access to limited stock",
  "Exclusive discounts & rewards",
  "Behind-the-scenes access",
  "First access to collaborations",
  "Surprise gifts and giveaways",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.btn} disabled={pending}>
      {pending ? "..." : "SUBSCRIBE"}
    </button>
  );
}

export function Newsletter() {
  const [state, formAction] = useActionState(subscribeAction, INITIAL_STATE);

  return (
    <section className={styles.section}>
      <div className={styles.ghost} aria-hidden="true">
        BLCKOLE
      </div>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Members only</span>
          <h2 className={styles.title}>
            Join the BLCKOLE
            <br />
            Inner Circle
          </h2>

          {state.status === "success" ? (
            <p className={styles.thanks}>
              You&apos;re in. Welcome to the Inner Circle.
            </p>
          ) : (
            <form className={styles.form} action={formAction}>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className={styles.input}
                defaultValue=""
              />
              <SubmitButton />
              {state.status === "error" && state.message ? (
                <p className={styles.error} role="alert">
                  {state.message}
                </p>
              ) : null}
            </form>
          )}

          <p className={styles.tagline}>
            Not everyone gets in.{" "}
            <span className={styles.taglineAccent}>Join the Inner Circle.</span>
          </p>
        </div>

        <div className={styles.benefits}>
          <p className={styles.benefitsIntro}>
            Become part of an exclusive community and unlock:
          </p>
          <ul className={styles.perks}>
            {PERKS.map((perk) => (
              <li key={perk} className={styles.perk}>
                <span className={styles.tick} aria-hidden="true">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
