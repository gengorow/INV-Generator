const SECRET_TOKEN = process.env.TOKEN;
const Discord = require("discord.js");
const client = new Discord.Client();

// このIDのチャンネルを監視対象とします。
const CHANNEL_ID = 258537564884041728;

// 文頭がこの文字列のメッセージを監視対象とします
const PREFIX = "H";

// この数字ミリ秒だけメッセージの監視を行います。
// 現在30分に設定してあります。
const WAIT_TIME = 1800000;

// ボットのセリフ集
const CHATS = ["チラチラ見ている。", "仲間になりたそうにこちらを見ている。",
    "野獣の眼光でこちらを見ている。", "こちらの尻穴を狙っている。", "ねっとりとした目つきでこちらを見ている。",
    "我が子を見守るような温かい目でこちらを見ている。", "養豚場の豚を見るような目でこちらを見ている。",
    "ごちそうを見るかのような目でこちらを見ている。", "脱ぎ終わったのになかなか出てこない。"];

client.on("ready", () =>  console.log("----INV Generatir is WATCHING YOU----") );

// 特定のメッセージを監視対象にします
client.on("message", message => {
    // パーティー募集チャンネルじゃないメッセージ、Hから始まらないメッセージを除外しています
    // if (message.channel.id != CHANNEL_ID) return;
    if (!message.content.startsWith(PREFIX)) return;
    
    setAwait(message);
    console.log("a message under WATCHING");
});

/**
 * メッセージにリアクションがついたとき、そのメッセージに返信を送ります。
 * 書式がみんなバラバラなため一部記号含む英数字の中で一番長いのをゲーム内ネームとしています。
 * たぶんそこそこうまくいく(適当)
 * @param {Message} message 監視対象のメッセージ
 */
function setAwait(message) {
    const filter = (reaction, user) => { return true; }
    
    message.awaitReactions(filter, { max: 1, time: WAIT_TIME, errors: ['time'] })
        .then(collected => {
            // ニックネーム
            const name = collected.first().message.member.displayName;

            // ゲーム内ネーム候補リスト
            let ign = name.match(/[0-9a-zA-Z_\.-]+/g);

            // 一番長いのをゲーム内ネームとします
            ign.sort((a, b) => {
                const x = a.length;
                const y = b.length;
                if( x > y ) return -1;
                if( x < y ) return 1;
                return 0;
            })

            message.reply(`
                ${name} が${getChat()}
                /inv ${ign[0]}
            `);

            // awaitReactionsは一度しか動作しないため再帰させます。
            setAwait(message);
        }).catch(() => {});
} 

// ランダムなセリフを返します。
function getChat() {
    const r = Math.floor(Math.random() * CHATS.length);
    return CHATS[r];
}

client.login(SECRET_TOKEN);
