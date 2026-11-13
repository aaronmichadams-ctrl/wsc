/**
 * Every bit of editable copy on the site lives here.
 * Change words, prices, emails and photos in this one file.
 * House rule: no em dashes in the copy.
 */

export const brand = {
  name: 'Weekly Social Co.',
  shortName: 'Weekly Social',
  city: 'Woodstock, GA',
  mascotName: 'Wes',
};

export const nav = [
  { label: 'How it works', href: '#how' },
  { label: 'Packages', href: '#packages' },
  { label: 'Meet us', href: '#team' },
  { label: 'Free audit', href: '#audit' },
];

export const hero = {
  headlineLead: 'Social media that doesn’t look like',
  headlineScribble: 'everyone else’s.',
  subline:
    'Weekly content for local home-service businesses, made by real humans in Woodstock, GA.',
  primaryCta: { label: 'Get a Free Audit', href: '#audit' },
  secondaryCta: { label: 'See How It Works', href: '#how' },
};

export const problem = {
  title: 'Spot the difference',
  intro: 'Most agency posts look like they came out of a vending machine. Ours look like you.',
  boring: {
    label: 'The boring agency post',
    caption: 'Stock photo. Buzzwords. 2 likes (one is your mom).',
  },
  ours: {
    label: 'A Weekly Social post',
    caption: 'Your crew. Your trucks. Real neighbors asking for a quote.',
  },
};

export const trades = {
  title: 'Who we help',
  intro: 'If you fix it, build it, clean it or grow it, we can make it look good online.',
  items: [
    { key: 'hvac', label: 'HVAC' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'roofing', label: 'Roofing' },
    { key: 'landscaping', label: 'Landscaping' },
    { key: 'detailing', label: 'Auto detailing' },
    { key: 'yours', label: 'Your trade here' },
  ],
};

export const steps = {
  title: 'How it works',
  intro: 'Same rhythm every week. You run your business. We run your feed.',
  items: [
    { title: 'We plan your week', body: 'A quick check-in, then we map out what to post and when.' },
    { title: 'We make the content', body: 'Photos, short videos and captions that sound like you, not a robot.' },
    { title: 'We post it', body: 'On time, every time, on the platforms your customers actually use.' },
    { title: 'You get more calls', body: 'Neighbors see you, remember you, and pick up the phone.' },
  ],
};

/** Packages. Prices are placeholders. Edit freely. */
export const packages = {
  title: 'Pick your package',
  intro: 'No long contracts. No mystery fees. Cancel any month.',
  note: 'All prices are monthly. Placeholder pricing, ask us for a quote.',
  items: [
    {
      name: 'Starter',
      price: '$499',
      period: '/mo',
      blurb: 'Show up consistently without thinking about it.',
      features: ['8 posts a month', '1 platform', 'Captions + hashtags', 'Monthly check-in'],
      color: 'blue',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$899',
      period: '/mo',
      blurb: 'Our favorite. Steady posting plus short videos.',
      features: [
        '12 posts a month',
        '2 platforms',
        '4 short-form videos',
        'Comment + DM replies',
        'Monthly results recap',
      ],
      color: 'yellow',
      popular: true,
    },
    {
      name: 'Full',
      price: '$1,499',
      period: '/mo',
      blurb: 'The whole crayon box. We handle all of it.',
      features: [
        '20 posts a month',
        '3 platforms',
        '8 short-form videos',
        'On-site content day',
        'Review + reputation help',
      ],
      color: 'green',
      popular: false,
    },
  ],
  popularLabel: 'Most popular',
  cta: 'Start with a free audit',
};

/**
 * Testimonial. PLACEHOLDER TEXT: replace `quote` with NXT Soccer's real words
 * before launch.
 */
export const testimonial = {
  quote:
    'Placeholder quote: Weekly Social Co. helped us clean up our online presence and our engagement jumped. Parents actually comment on our posts now.',
  name: 'NXT Soccer',
  role: 'Client',
};

/** Team. Drop real photos in /public/team and set `photo` to '/team/aaron.jpg' etc. */
export const team = {
  title: 'Meet us',
  intro: 'Two real people. No call center. No account manager you never meet.',
  people: [
    {
      name: 'Aaron',
      role: 'Co-founder',
      bio: 'Plans the content, runs the cameras and drinks too much sweet tea.',
      email: 'aaron@weeklysocialco.com',
      photo: '',
    },
    {
      name: 'Addy',
      role: 'Co-founder',
      bio: 'Writes the captions, talks to your customers and keeps us on schedule.',
      email: 'addy@weeklysocialco.com',
      photo: '',
    },
  ],
};

export const audit = {
  title: 'Get a free social media audit',
  intro: 'Tell us where you are online. We will tell you what is working, what is not, and what we would do first.',
  promise: 'Delivered within 72 hours.',
  submit: 'Send me my audit',
  sending: 'Sending...',
  successTitle: 'Got it!',
  successBody: 'Your audit is on the way. Look for it in your inbox within 72 hours.',
  errorBody: 'Hmm, that did not go through. Try again, or email us directly.',
  fields: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    company: 'Company name',
    instagram: 'Instagram handle',
    facebook: 'Facebook page',
    tiktok: 'TikTok handle',
  },
  optionalLabel: 'optional',
};

export const footer = {
  emails: ['aaron@weeklysocialco.com', 'addy@weeklysocialco.com'],
  location: 'Woodstock, GA',
  signoff: 'Drawn with crayons and too much coffee.',
};
