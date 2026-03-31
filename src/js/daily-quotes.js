/**
 * Daily Random 毒鸡汤 (Toxic Chicken Soup) Quotes
 * 
 * A collection of sarcastic / dark-humour motivational quotes.
 * One quote is deterministically selected per day using a date-based seed
 * so all users see the same quote on the same day.
 */

// eslint-disable-next-line no-unused-vars
const DAILY_QUOTES = [
  "努力不一定成功，但不努力一定很轻松。",
  "条条大路通罗马，而有些人就生在罗马。",
  "又一天过去了，今天过得怎么样？梦想是不是更远了？",
  "如果你觉得自己一整天累得跟狗一样，那你真是误会大了——狗都没你那么累。",
  "失败并不可怕，可怕的是你还相信这句话。",
  "世上无难事，只要肯放弃。",
  "你以为有钱人很快乐吗？他们的快乐你根本想象不到。",
  "比你优秀的人比你还努力，所以你努力有什么用？",
  "生活不止眼前的苟且，还有未来的苟且。",
  "只要是石头，到哪里都不会发光的。",
  "上帝为你关上一扇门的时候，顺便还会夹你的脑袋。",
  "假如生活欺骗了你，不要悲伤，不要心急，多被骗几次就习惯了。",
  "有人出生就在终点，有人出生连起跑线都没有。",
  "丑小鸭变成白天鹅，并不是它有多努力，是因为它的父母就是白天鹅。",
  "你努力后的成功，远不如别人随便搞搞。",
  "认真你就输了，不认真你连输的资格都没有。",
  "等忙完这一阵，就可以接着忙下一阵了。",
  "不怕别人瞧不起你，就怕你自己也瞧不起自己……算了，反正早就这样了。",
  "今天不想跑，所以才去跑；这句话真的有道理吗？没有，但我还是不想跑。",
  "有些人努力了一辈子，勉强达到了别人的起点。",
  "当你感到悲伤的时候，最好去学些什么东西——学了你就会发现考试更悲伤。",
  "天下无不散之宴席，但你好像从来没被邀请过。",
  "如果你不出去走走，你以为这就是全世界；你出去走走后，会发现果然还是家里好。",
  "你年轻时吃的苦，老了以后会回忆起来——还是苦。",
  "人生就像一盒巧克力，打开一看全是黑的。",
  "知识改变命运——可惜你不爱学。",
  "每天叫醒你的不是梦想，是穷。",
  "你不是一无所有，你还有病。",
  "在哪里跌倒就在哪里躺下，何必站起来再跌一次。",
  "梦想还是要有的，不然喝多了跟人聊什么。",
  "如果我的人生是一部电影，那观众早就退场了。",
  "人生没有彩排，每天都是直播——但收视率为零。",
  "你全力做到最好，结果也就那样。",
  "永远不要放弃梦想，万一哪天做噩梦呢。",
  "机会总是留给有准备的人的，但你永远没准备好。",
  "生活总是让我们遍体鳞伤，但到后来那些受伤的地方——一定会结疤，然后更丑。",
  "别灰心，灰心也没用。",
  "你要逼自己优秀，然后骄傲地生活——这话说说简单。",
  "理想很丰满，现实很骨感，你很胖。",
  "你不努力一下，怎么知道什么叫绝望。"
];

/**
 * Get a deterministic daily quote index using date string as seed.
 * All users see the same quote on the same day.
 * @returns {number} Index into DAILY_QUOTES array
 */
function getDailyQuoteIndex() {
  const today = new Date();
  // Use YYYY-MM-DD format as seed
  const dateStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  // Simple hash to convert date string to a number
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }

  return Math.abs(hash) % DAILY_QUOTES.length;
}

/**
 * Get today's daily quote string.
 * @returns {string} The quote for today
 */
// eslint-disable-next-line no-unused-vars
function getDailyQuote() {
  return DAILY_QUOTES[getDailyQuoteIndex()];
}
