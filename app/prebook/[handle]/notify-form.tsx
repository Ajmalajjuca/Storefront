"use client";

import {
  subscribeAction,
  type NewsletterState,
} from "components/newsletter/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styles from "./page.module.css";

const INITIAL_STATE: NewsletterState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Adding…" : "Notify me"}
    </button>
  );
}

export function NotifyForm() {
  const [state, formAction] = useActionState(subscribeAction, INITIAL_STATE);

  if (state.status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successTick} aria-hidden="true">
          ✓
        </span>
        You&apos;re on the list — we&apos;ll email you the moment it drops.
      </div>
    );
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.field}>
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
      </div>
      {state.status === "error" && state.message ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
