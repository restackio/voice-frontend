const emojis = [
  "127815", // grapes
  "127816", // melon
  "127817", // watermelon
  "127818", // tangerine
  "127819", // lemon
  "127820", // banana
  "127821", // pineapple
  "127822", // mango
  "127823", // red apple
  "127824", // green apple
  "127825", // pear
  "127826", // peach
  "127827", // cherries
  "127828", // strawberry
  "127829", // kiwi fruit
  "127830", // tomato
  "127831", // coconut
  "128169", // poop
  "128640", // rocket
  "127752", // rainbow
  "11088", // star
  "128293", // fire
  "128167", // droplet
  "127808", // four_leaf_clover
  "127829", // pizza
  "127881", // tada
  "127880", // balloon
  "127873", // gift
  "127912", // art
  "127925", // musical_note
  "127928", // guitar
  "127908", // microphone
  "127911", // headphones
  "127916", // clapper
  "127918", // video_game
  "127922", // game_die
  "127919", // dart
  "127923", // bowling
  "127935", // ski
  "127936", // basketball
  "127944", // football
  "127945", // rugby_football
  "127955", // ping_pong
  "127992", // badminton
  "127993", // bow_and_arrow
  "127994", // amphora
  "128278", // label
  "127989", // rosette
  "127988", // black_flag
  "127987", // white_flag
  "129313", // clown_face
  "128125", // alien
  "128126", // space_invader
  "129302", // robot_face
  "127875", // jack_o_lantern
  "129412", // unicorn_face
  "128009", // dragon
  "128050", // dragon_face
  "129430", // t_rex
  "129429", // sauropod
  "129503", // zombie
  "129501", // vampire
  "129497", // mage
  "129498", // fairy
  "129499", // genie
  "129500", // merperson
  "129496", // elf
  "129504", // troll
  "129497", // superhero
  "129498", // supervillain
  "128123", // alien_monster
  "129299", // astronaut
  "129302", // scientist
  "127908", // singer
  "127859", // cook
  "127979", // teacher
  "128110", // judge
  "128104", // farmer
  "128658", // firefighter
  "128640", // pilot
  "129299", // astronaut
];

export const getRandomColor = () =>
  `${Math.floor(Math.random() * 16777215).toString(16)}`;

export const randomUser = () => {
  const emojiCode = emojis[Math.floor(Math.random() * emojis.length)];
  const color = getRandomColor();
  const username = `${emojiCode}-${color}`;
  return username;
};

export const getEmojiFromUsername = (username: string) => {
  const emojiCode = username.split("-")[0];
  if (!emojiCode) return "";
  return emojiCode && String.fromCodePoint(parseInt(emojiCode));
};

export const getColorFromUsername = (username: string) => {
  const color = username.split("-")[1];
  return `#${color}`;
};
