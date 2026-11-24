import { useEffect, useState } from "react";

type Props = {
  words: string[];
  className?: string;
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
};

export function TypingText({
  words,
  className,
  loop = true,
  typeSpeed = 80,
  deleteSpeed = 45,
  pause = 1400,
}: Props) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[index % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && sub === current) {
      if (!loop && index === words.length - 1) return;
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && sub === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      t = setTimeout(
        () => {
          setSub((s) =>
            deleting ? current.slice(0, s.length - 1) : current.slice(0, s.length + 1),
          );
        },
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(t);
  }, [sub, deleting, index, words, loop, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {sub}
      <span className="inline-block w-[2px] h-[0.9em] align-middle bg-current ml-0.5 animate-pulse" />
    </span>
  );
}

export function TypeOnce({
  text,
  className,
  speed = 90,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [sub, setSub] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSub("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setSub(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className={className}>
      {sub}
      {sub.length < text.length && (
        <span className="inline-block w-[2px] h-[0.9em] align-middle bg-current ml-0.5 animate-pulse" />
      )}
    </span>
  );
}