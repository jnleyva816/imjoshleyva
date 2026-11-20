/**
 * A paragraph that rises in word by word (CSS, see .word in index.css).
 * Give it a new `key` to replay. Screen readers get the sentence once.
 */
export default function RevealText({ text, className = "", ...rest }) {
  const words = text.split(" ");

  return (
    <p className={className} {...rest}>
      <span className="sr-only">{text}</span>
      {words.map((item, index) => (
        <span key={`${item}-${index}`} aria-hidden="true">
          <span className="word" style={{ "--i": index }}>
            {item}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
