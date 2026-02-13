/**
 * Telegram Notification Utility
 * Sends messages to a configured Telegram bot
 */

// These would normally be in an environment variable or config file
const TELEGRAM_BOT_TOKEN = "7909249787:AAH0p1Dka7R7Q8R1N9N9X6X8X8X8X8X8X8X"; // Placeholder
const TELEGRAM_CHAT_ID = "634817452"; // Placeholder

export const sendTelegramNotification = async (message) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn("Telegram notification skipped: Missing BOT_TOKEN or CHAT_ID");
        return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram notification error:', errorData);
        }
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
};

export default sendTelegramNotification;
