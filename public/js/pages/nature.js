import {
  BG, R, C, E, B, P,
  ink, L, D, sparkle, star, sun, sunRays, cloud, cloudPath, heart,
  eyes, smile, cheeks, hill, grass, flower, butterfly, birds,
  pageSvg,
} from '../artkit.js';

/* ------------------------------------------------------------------ */
/* Flower Power                                                        */
/* ------------------------------------------------------------------ */
const bigPetals = (() => {
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const px = 500 + Math.cos(a) * 142;
    const py = 372 + Math.sin(a) * 142;
    const rot = (a * 180) / Math.PI + 90;
    out += E(px, py, 84, 52, i % 2 === 0 ? 1 : 3, `transform="rotate(${rot} ${px} ${py})"`);
  }
  return out;
})();

const flowerSmall = flower(150, 600, 0.8, 3, 4);
const flowerSmall2 = flower(842, 606, 0.7, 1, 4);
const flowerButterfly = butterfly(780, 270, 0.85);

const flowerPage = pageSvg(
  'A giant smiling daisy in a sunny meadow with a bee',
  `${BG()}
   ${C(500, 390, 305, 6)}
   ${sun(840, 130, 60)}
   ${cloud(150, 150, 0.8)} ${cloud(680, 210, 0.45)}
   ${hill(642, 5)}
   ${flowerSmall.regions}${flowerSmall2.regions}${flowerButterfly.regions}
   ${R('M 486 670 Q 470 540 488 395 L 524 392 Q 516 540 530 670 Z', 5)}
   ${R('M 500 560 Q 588 502 654 548 Q 620 594 560 604 Q 526 594 500 560 Z', 5)}
   ${R('M 488 600 Q 402 554 342 588 Q 370 630 432 634 Q 470 628 488 600 Z', 5)}
   ${bigPetals}
   ${C(500, 372, 106, 2)}
   ${C(500, 372, 104, 2, 'stroke="none"')}
   ${R('M 230 652 Q 270 596 312 640 Q 286 676 252 668 Z', 3)}
   ${C(242, 646, 9, 4)} ${C(272, 660, 7, 4)} ${C(292, 638, 6, 4)}
   ${E(688, 300, 25, 18, 6, 'transform="rotate(-30 688 300)"')}
   ${E(710, 320, 25, 18, 6, 'transform="rotate(28 710 320)"')}
   ${E(694, 342, 37, 26, 3)}
   ${P('686 311 692 340 676 318', 2)}`,
  `${sunRays(840, 130, 60)}
   ${eyes(840, 122, 19, 6)} ${smile(840, 145, 24, 7)}
   ${flowerSmall.details}${flowerSmall2.details}${flowerButterfly.details}
   ${L('M 505 560 Q 550 535 600 548')}
   ${L('M 492 590 Q 445 570 400 590')}
   ${L('M 552 544 Q 570 562 590 568 M 595 556 Q 612 570 630 572', 'stroke-width="5" opacity=".5"')}
   ${eyes(500, 352, 40, 11)}
   ${smile(500, 390, 50, 18)}
   ${cheeks(500, 392, 73, 15, 8)}
   ${L('M 462 320 Q 475 308 490 316 M 510 316 Q 525 308 538 320', 'stroke-width="5"')}
   ${L('M 630 596 Q 660 574 696 588', 'stroke-width="5"')}
   ${L('M 825 290 Q 850 260 870 270 M 835 330 Q 860 310 882 316', 'stroke-width="5"')}
   ${L('M 688 300 Q 678 330 694 342 Q 710 330 710 320', 'stroke-width="5"')}
   ${L('M 230 652 Q 250 672 280 674', 'stroke-width="5" opacity=".5"')}
   ${ink(grass(90, 695, 0.85))} ${ink(grass(930, 700, 0.8))}
   ${ink(sparkle(330, 250, 11))} ${ink(sparkle(700, 430, 8))}`,
);

/* ------------------------------------------------------------------ */
/* Rainbow Skies                                                       */
/* ------------------------------------------------------------------ */
const rainbowBand2 = (cx, cy, radius, thickness, tone) => {
  const inner = radius - thickness;
  return R(
    `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}
     L ${cx + inner} ${cy} A ${inner} ${inner} 0 0 0 ${cx - inner} ${cy} Z`,
    tone,
  );
};

const rainbowFlower = flower(130, 590, 0.8, 3, 4);
const rainbowFlower2 = flower(875, 605, 0.7, 1, 4);

const rainbowPage = pageSvg(
  'A big rainbow over a flowery meadow with a kite',
  `${BG()}
   ${rainbowBand2(500, 708, 450, 42, 1)}
   ${rainbowBand2(500, 708, 408, 42, 2)}
   ${rainbowBand2(500, 708, 366, 42, 3)}
   ${rainbowBand2(500, 708, 324, 42, 4)}
   ${rainbowBand2(500, 708, 282, 42, 5)}
   ${sun(145, 132, 55)}
   ${cloud(112, 630, 0.95)} ${cloud(887, 638, 0.95)}
   ${cloud(750, 210, 0.4)} ${cloud(330, 170, 0.34)}
   ${hill(648, 5)}
   ${rainbowFlower.regions}${rainbowFlower2.regions}
   ${R('M 694 150 L 758 190 L 706 252 L 642 210 Z', 3)}
   ${R('M 694 150 L 704 210 L 758 190 Z', 1)}
   ${R('M 694 150 L 642 210 L 704 210 Z', 4)}
   ${C(806, 490, 36, 4)} ${C(852, 410, 24, 3)} ${C(894, 336, 16, 4)}`,
  `${sunRays(145, 132, 55)}
   ${eyes(145, 125, 17, 5)} ${smile(145, 146, 22, 7)}
   ${L('M 105 666 Q 170 630 235 660 Q 300 690 360 656', 'stroke-width="6"')}
   ${L('M 640 662 Q 720 624 800 654 Q 850 670 900 648', 'stroke-width="6"')}
   ${rainbowFlower.details}${rainbowFlower2.details}
   ${L('M 694 150 L 706 252 M 642 210 L 758 190')}
   ${L('M 706 252 Q 730 320 710 380 Q 742 392 760 420', 'stroke-width="5"')}
   ${L('M 727 316 L 708 300 M 740 348 L 760 332 M 752 392 L 735 378', 'stroke-width="4"')}
   ${ink(birds([[590, 240, 0.8], [630, 208, 0.55]]))}
   ${L('M 806 526 Q 852 550 884 530 M 816 508 Q 846 524 864 512', 'stroke-width="5" opacity=".4"')}
   ${L('M 838 400 Q 854 396 864 408 M 880 326 Q 894 320 904 332', 'stroke-width="4"')}
   ${L('M 760 608 Q 810 586 860 606', 'stroke-width="5"')}
   ${L('M 78 676 Q 124 650 180 676', 'stroke-width="5"')}
   ${L('M 470 692 Q 500 676 530 692', 'stroke-width="5" opacity=".5"')}
   ${ink(grass(90, 695, 0.75))} ${ink(grass(930, 695, 0.75))}
   ${ink(sparkle(560, 250, 10))} ${ink(sparkle(260, 300, 8))}`,
);

/* ------------------------------------------------------------------ */
/* Big Friendly Tree                                                   */
/* ------------------------------------------------------------------ */
const treeSmall = flower(130, 620, 0.7, 3, 4);
const treeSmall2 = flower(870, 610, 0.65, 1, 4);

const tree = pageSvg(
  'A big friendly tree with apples, a swing and a bird',
  `${BG()}
   ${C(500, 390, 305, 6)}
   ${sun(835, 130, 58)}
   ${cloud(160, 155, 0.8)} ${cloud(700, 220, 0.46)}
   ${hill(640, 5)}
   ${treeSmall.regions}${treeSmall2.regions}
   ${R('M 428 620 Q 418 500 436 420 L 564 420 Q 582 510 572 620 Q 520 650 428 620 Z', 4)}
   ${R('M 432 600 Q 372 620 330 668 L 392 670 Q 432 646 456 634 Z', 4)}
   ${R('M 568 600 Q 628 620 670 668 L 608 670 Q 568 646 544 634 Z', 4)}
   ${cloud(500, 212, 1.42, 1)}
   ${cloud(360, 300, 1.05, 3)}
   ${cloud(644, 300, 1.05, 2)}
   ${cloud(450, 355, 0.8, 2)}
   ${cloud(570, 355, 0.82, 3)}
   ${cloud(500, 130, 0.82, 2)}
   ${C(380, 250, 25, 4)} ${C(600, 242, 22, 4)}
   ${C(500, 330, 19, 4)} ${C(435, 385, 18, 4)} ${C(585, 380, 17, 4)}
   ${C(662, 336, 16, 4)} ${C(330, 335, 16, 4)}
   ${B(678, 520, 112, 22, 3, 10)}
   ${R('M 522 570 Q 530 520 550 492 Q 570 520 566 570 Z', 3)}
   ${B(772, 538, 15, 66, 4, 6)}
   ${B(760, 528, 48, 14, 4, 5)}
   ${P('752 542 802 542 782 586', 3)}
   ${C(272, 622, 42, 3)} ${C(302, 608, 25, 4)}
   ${C(712, 620, 34, 4)} ${C(740, 610, 22, 3)}
   ${C(622, 638, 10, 6)} ${C(648, 628, 7, 6)} ${C(668, 644, 6, 6)}`,
  `${sunRays(835, 130, 58)}
   ${eyes(835, 122, 18, 6)} ${smile(835, 145, 23, 7)}
   ${treeSmall.details}${treeSmall2.details}
   ${L('M 500 212 Q 380 260 340 330 M 500 212 Q 640 260 680 330')}
   ${L('M 454 350 Q 500 330 546 350 M 398 300 Q 430 280 464 292 M 600 292 Q 635 276 662 300', 'stroke-width="5" opacity=".45"')}
   ${L('M 472 470 Q 500 446 528 470 M 460 505 Q 500 478 540 505 M 470 545 Q 500 526 530 545', 'stroke-width="5" opacity=".55"')}
   ${eyes(500, 500, 33, 9)}
   ${smile(500, 532, 44, 16)}
   ${cheeks(500, 527, 61, 12, 7)}
   ${L('M 455 472 Q 470 460 485 468 M 515 468 Q 530 460 545 472', 'stroke-width="4"')}
   ${L('M 678 520 Q 698 566 692 600 M 790 520 Q 768 566 776 600', 'stroke-width="5"')}
   ${L('M 680 520 L 790 520', 'stroke-width="4"')}
   ${L('M 452 560 Q 478 584 512 584')}
   ${L('M 380 250 Q 390 232 406 230 M 578 242 Q 594 226 612 228', 'stroke-width="5"')}
   ${L('M 325 335 Q 340 318 360 322 M 646 336 Q 660 318 678 322', 'stroke-width="4"')}
   ${L('M 330 640 Q 370 620 410 636 M 590 636 Q 630 618 672 640', 'stroke-width="5" opacity=".4"')}
   ${L('M 760 528 Q 784 514 808 528')}
   ${L('M 784 586 Q 796 600 812 606', 'stroke-width="5"')}
   ${L('M 266 612 Q 254 636 266 654 M 282 636 Q 272 650 284 664', 'stroke-width="4" opacity=".5"')}
   ${ink(grass(100, 696, 0.8))} ${ink(grass(920, 696, 0.8))}
   ${ink(sparkle(760, 200, 10))} ${ink(sparkle(290, 260, 8))}
   ${ink(birds([[740, 300, 0.5], [770, 280, 0.4]]))}`,
);

/* ------------------------------------------------------------------ */
/* Sunny Weather                                                       */
/* ------------------------------------------------------------------ */
const sunCloud = pageSvg(
  'A giant happy smiling sun with warm rays and fluffy clouds',
  `${BG()}
   ${sun(500, 310, 160)}
   ${cloud(220, 460, 1.2)}
   ${cloud(780, 460, 1.2)}
   ${hill(610, 5)}
   ${C(160, 590, 25, 4)} ${C(840, 590, 25, 4)}`,
  `${sunRays(500, 310, 160)}
   ${eyes(500, 290, 56, 15)}
   ${smile(500, 345, 65, 22)}
   ${cheeks(500, 340, 95, 20, 11)}
   ${eyes(220, 445, 25, 7)}
   ${smile(220, 470, 30, 9)}
   ${cheeks(220, 468, 42, 10, 6)}
   ${eyes(780, 445, 25, 7)}
   ${smile(780, 470, 30, 9)}
   ${cheeks(780, 468, 42, 10, 6)}
   ${ink(birds([[420, 140, 0.7], [460, 120, 0.5]]))}`,
);

/* ------------------------------------------------------------------ */
/* Mushroom Cottage                                                    */
/* ------------------------------------------------------------------ */
const mushroomHouse = pageSvg(
  'A fairytale toadstool cottage with round door and chimney',
  `${BG()}
   ${sun(820, 140, 65)}
   ${cloud(170, 150, 0.8)} ${cloud(680, 220, 0.45)}
   ${hill(610, 5)}
   ${R('M 600 280 L 600 180 L 650 180 L 650 310 Z', 4)}
   ${cloud(625, 140, 0.5, 6)}
   ${R('M 360 420 Q 340 560 320 650 L 680 650 Q 660 560 640 420 Z', 2)}
   ${R('M 220 440 C 220 230 780 230 780 440 C 780 465 740 475 700 460 C 600 420 400 420 300 460 C 260 475 220 465 220 440 Z', 1)}
   ${C(350, 310, 32, 6)} ${C(500, 270, 42, 6)} ${C(650, 310, 32, 6)}
   ${C(430, 370, 24, 6)} ${C(570, 370, 24, 6)}
   ${R('M 430 650 L 430 530 C 430 480 570 480 570 530 L 570 650 Z', 4)}
   ${C(540, 580, 8, 3)}
   ${C(370, 530, 32, 6)}
   ${C(630, 530, 32, 6)}`,
  `${sunRays(820, 140, 65)}
   ${eyes(820, 132, 20, 6)} ${smile(820, 155, 26, 8)}
   ${L('M 370 500 L 370 560 M 340 530 L 400 530', 'stroke-width="5"')}
   ${L('M 630 500 L 630 560 M 600 530 L 660 530', 'stroke-width="5"')}
   ${ink(grass(120, 680, 0.9))} ${ink(grass(880, 680, 0.8))}`,
);

/* ------------------------------------------------------------------ */
/* Butterfly Bloom                                                     */
/* ------------------------------------------------------------------ */
const butterflyGarden = pageSvg(
  'A giant beautiful butterfly resting on a blooming garden',
  `${BG()}
   ${sun(180, 140, 60)}
   ${cloud(760, 150, 0.8)} ${cloud(640, 220, 0.45)}
   ${hill(610, 5)}
   ${R('M 500 370 C 440 220 240 180 180 260 C 120 340 220 460 380 430 C 240 480 200 600 300 640 C 380 670 460 560 500 450 Z', 1)}
   ${R('M 500 370 C 560 220 760 180 820 260 C 880 340 780 460 620 430 C 760 480 800 600 700 640 C 620 670 540 560 500 450 Z', 1)}
   ${C(300, 300, 35, 4)} ${C(700, 300, 35, 4)}
   ${C(330, 560, 28, 4)} ${C(670, 560, 28, 4)}
   ${E(500, 410, 26, 95, 3)}
   ${C(500, 290, 35, 3)}`,
  `${sunRays(180, 140, 60)}
   ${eyes(180, 132, 19, 6)} ${smile(180, 154, 24, 7)}
   ${eyes(500, 285, 14, 5)}
   ${smile(500, 305, 18, 6)}
   ${L('M 490 265 Q 460 220 430 230 M 510 265 Q 540 220 570 230', 'stroke-width="5"')}
   ${C(430, 230, 8, 4)} ${C(570, 230, 8, 4)}
   ${ink(grass(120, 680, 0.9))} ${ink(grass(880, 680, 0.8))}`,
);

/* ------------------------------------------------------------------ */
/* Campfire Night                                                      */
/* ------------------------------------------------------------------ */
const camping = pageSvg(
  'A cozy pointed camping tent and a warm campfire under stars',
  `${BG()}
   ${C(820, 160, 60, 4)}
   ${C(800, 145, 55, 6)}
   ${star(180, 160, 25, 4)} ${star(340, 210, 18, 4)} ${star(640, 180, 22, 4)}
   ${hill(610, 5)}
   ${R('M 180 610 L 400 280 L 620 610 Z', 1)}
   ${R('M 400 280 L 400 610 L 470 610 Z', 3)}
   ${R('M 400 280 L 330 610 L 400 610 Z', 2)}
   ${B(660, 570, 140, 24, 4, 10, 'transform="rotate(20 660 570)"')}
   ${B(660, 570, 140, 24, 4, 10, 'transform="rotate(-20 660 570)"')}
   ${R('M 690 580 C 670 510 700 460 730 420 C 760 460 790 510 770 580 Z', 3)}
   ${R('M 705 580 C 695 530 715 490 730 460 C 745 490 765 530 755 580 Z', 4)}`,
  `${L('M 400 280 L 400 610', 'stroke-width="7"')}
   ${eyes(400, 420, 25, 7)}
   ${smile(400, 445, 30, 9)}
   ${ink(grass(120, 680, 0.9))} ${ink(grass(880, 680, 0.8))}`,
);

export const naturePages = [
  {
    id: 'flower',
    title: 'Flower Power',
    category: 'nature',
    blurb: 'A giant daisy and a busy bee',
    art: flowerPage,
  },
  {
    id: 'rainbow',
    title: 'Rainbow Skies',
    category: 'nature',
    blurb: 'A rainbow, a kite, a happy sky',
    art: rainbowPage,
  },
  {
    id: 'tree',
    title: 'Big Friendly Tree',
    category: 'nature',
    blurb: 'Apples, swings and a tree face',
    art: tree,
  },
  {
    id: 'sun-cloud',
    title: 'Sunny Weather',
    category: 'nature',
    blurb: 'A giant smiling sun and friendly clouds',
    art: sunCloud,
  },
  {
    id: 'mushroom-house',
    title: 'Mushroom Cottage',
    category: 'nature',
    blurb: 'A cozy fairy home in the meadow',
    art: mushroomHouse,
  },
  {
    id: 'butterfly-garden',
    title: 'Butterfly Bloom',
    category: 'nature',
    blurb: 'Giant wings resting on sunny flowers',
    art: butterflyGarden,
  },
  {
    id: 'camping',
    title: 'Campfire Night',
    category: 'nature',
    blurb: 'A cozy tent under crescent moon',
    art: camping,
  },
];
