const artImage = (filename, alt, width, height, sourceNode) => ({
  src: `/images/arts/${filename}`,
  alt,
  width,
  height,
  sourceNode,
});

export const artsContent = {
  intro: 'Art has been my constant language ever since I first learned how to hold a pen - long before Vietnamese, my native tongue, ever fully formed my spoken thoughts. Back in 2013, my go-to freetime routine consisted of a notebook, my favorite pencil, and a cranked up AC.\n\nWhat started as childhood doodles eventually evolved into a serious pursuit. I transitioned from casual sketching to investing in professional tools, studying countless tutorials, and committing to rigorous daily practice.\n\nThroughout high school, art became the anchor for my activities and social life, stretching beyond its simplest form of pen and paper. Today, it remains the driving force behind how I observe, interpret, and shape my experiences.',
  quote: '“The Earth without art is just eh.”',
  signSrc: '/images/arts/arts-sign.png',
  concert: {
    title: '"Viet Nam Tinh Hoa"\nMusic Concert',
    description: 'As the Art Collaborator of VNTH Music Concert, I delivered a tangible experience alongside the main musical event. Outside the concert hallways hang our handcrafted recycled glass exhibition that is not only a feast to the eyes but also aims to spread awareness on recycling in arts.',
    images: [
      artImage('tinh-hoa-concert-gathering.webp', 'Participants gathered on stage at the Viet Nam Tinh Hoa music concert.', 1200, 799, '114:146'),
      artImage('tinh-hoa-concert-stage.webp', 'The Viet Nam Tinh Hoa concert stage in the wood-panelled hall.', 1200, 799, '114:144'),
      artImage('tinh-hoa-concert-artwork.webp', 'Viet Nam Tinh Hoa concert artwork in pink and gold.', 1000, 1000, '114:145'),
      artImage('tinh-hoa-concert-team.webp', 'The concert team in front of the Viet Nam Tinh Hoa event backdrop.', 1200, 801, '114:150'),
    ],
  },
  exhibition: {
    title: '"Viet Nam Gam Hoa"\nExhibition',
    artSpaceTitle: '“Viet Nam Gam Hoa” Art Space',
    introduction: 'After years dedicated to digital art, hosting the ‘Viet Nam Gam Hoa’ Art Space marked a deeply nostalgic return to my roots in traditional mediums. Stepping away from the screen to work with physical materials - specifically integrating fragments of broken glass into the art pieces - pushed my technical boundaries and reconnected me with the hands-on passion that started it all.',
    impact: 'Beyond its personal meaning, the exhibition became a powerful platform for community impact. Thanks to the visitors’ great support, we successfully raised a good sum from the sales—-which was then donated to charity. I found great delight in the project as it was my own testament to how art can drive positive change.',
    displayImages: [
      artImage('gam-hoa-art-display.webp', 'Small framed artworks arranged with flowers at the Viet Nam Gam Hoa exhibition.', 1000, 667, '114:180'),
      artImage('gam-hoa-artists.webp', 'Three artists behind the exhibition table and its collection of framed artworks.', 1000, 667, '114:176'),
      artImage('gam-hoa-art-space.webp', 'A wide view of the Viet Nam Gam Hoa art display.', 1000, 667, '114:177'),
    ],
    featureImages: [
      artImage('gam-hoa-exhibition-poster.webp', 'The Viet Nam Gam Hoa exhibition poster beside flowers and handmade display pieces.', 900, 1352, '114:178'),
      artImage('gam-hoa-presentation.webp', 'Linh speaking with visitors at the Viet Nam Gam Hoa exhibition.', 1200, 636, '114:175'),
      artImage('gam-hoa-visitors.webp', 'Visitors and organisers speaking beside the exhibition display.', 1200, 633, '114:179'),
    ],
  },
  hat: {
    title: 'Hanoi-Amsterdam\nArt Team',
    description: 'This marks my very first opportunity at ‘high school clubs’ and ‘designing’ overall. HAT taught me the ins and outs of the school club system and was the very first home that welcomed me.',
    images: [
      artImage('hat-interview-results.webp', 'HAT interview-results artwork with a blue piano and moonlit waves.', 1000, 1000, '114:216'),
      artImage('hat-talk-show.webp', 'HAT talk-show artwork with a microphone against a dark blue stage.', 1000, 1000, '114:217'),
      artImage('hat-spring-artwork.webp', 'The Elixir of love artwork with a pink heart-shaped box and colourful ribbons.', 1000, 1000, '114:218'),
      artImage('hat-summer-artwork.webp', 'HAT illustration of a picnic blanket, keyboard and guitar beneath green trees.', 1000, 1000, '114:219'),
      artImage('hat-autumn-artwork.webp', 'HAT Ngày mai trả vé artwork with a glowing pink and purple portal.', 1000, 1000, '114:220'),
    ],
  },
};
