import { sendTelegramMessage } from "@/lib/telegram";
import type { ErrorCode } from "@/lib/validation";

/**
 * Sends a message to the hostess. With TELEGRAM_DRY_RUN=1 (or no bot configured in development) it
 * prints the message instead. Returns an error code on failure, or null on success.
 */
export async function deliverToHostess(text: string, label = "booking"): Promise<ErrorCode | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const configured = Boolean(botToken && chatId);

  if (process.env.TELEGRAM_DRY_RUN === "1" || (!configured && process.env.NODE_ENV !== "production")) {
    console.log(`\n[${label} dry run — nothing sent to Telegram]\n${text}\n`);
    return null;
  }
  if (!botToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return "server";
  }
  try {
    await sendTelegramMessage({ botToken, chatId, text });
  } catch (e) {
    console.error("Telegram send failed:", e instanceof Error ? e.message : e);
    return "telegram";
  }
  return null;
}
