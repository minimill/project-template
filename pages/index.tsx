import React from 'react';
import Head from 'next/head';
import Button from '../components/Button/Button';

export default function Home(): JSX.Element {
  return (
    <main>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p>
        Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh
        onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.
      </p>
      <p>
        Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot
        courgette tatsoi pea sprouts fava bean collard greens dandelion okra
        wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.
      </p>
      <p>
        Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce
        kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus
        winter purslane kale. Celery potato scallion desert raisin horseradish
        spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo
        shoot green bean swiss chard seakale pumpkin onion chickpea gram corn
        pea. Brussels sprout coriander water chestnut gourd swiss chard wakame
        kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts
        nori azuki bean chickweed potato bell pepper artichoke.
      </p>
      <Button href="/posts/first-post">First Post</Button>
    </main>
  );
}
