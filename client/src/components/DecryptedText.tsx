import React, { useState, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  className?: string;
  decryptDuration?: number;
  pauseDuration?: number;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className = "",
  decryptDuration = 1000,
  pauseDuration = 3000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(true);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    let animationId: number;
    let timeoutId: number;

    const startDecryption = () => {
      setIsDecrypting(true);
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / decryptDuration, 1);

        let result = "";

        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
          } else {
            const charProgress = Math.max(
              0,
              (progress * text.length - i) / text.length
            );

            if (charProgress >= 1) {
              result += text[i];
            } else if (charProgress > 0) {
              // Show random characters while decrypting
              result +=
                characters[Math.floor(Math.random() * characters.length)];
            } else {
              result +=
                characters[Math.floor(Math.random() * characters.length)];
            }
          }
        }

        setDisplayText(result);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          setIsDecrypting(false);

          // Wait before starting next cycle
          timeoutId = setTimeout(() => {
            startDecryption();
          }, pauseDuration);
        }
      };

      animate();
    };

    startDecryption();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, decryptDuration, pauseDuration]);

  return (
    <span
      className={`decrypted-text ${className} ${
        isDecrypting ? "decrypting" : "decrypted"
      }`}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
