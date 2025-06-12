const levelUpRules = [
  {
    "level": 2,
    "xp_required": 283,
    "acc_xp_required": 283
  },
  {
    "level": 3,
    "xp_required": 520,
    "acc_xp_required": 803
  },
  {
    "level": 4,
    "xp_required": 800,
    "acc_xp_required": 1603
  },
  {
    "level": 5,
    "xp_required": 1118,
    "acc_xp_required": 2721,
    "additional_requirements": {
      "stats": {
        "count": 2,
        "min_level": 2
      }
    }
  },
  {
    "level": 6,
    "xp_required": 1470,
    "acc_xp_required": 4191
  },
  {
    "level": 7,
    "xp_required": 1852,
    "acc_xp_required": 6043
  },
  {
    "level": 8,
    "xp_required": 2263,
    "acc_xp_required": 8306
  },
  {
    "level": 9,
    "xp_required": 2700,
    "acc_xp_required": 11006
  },
  {
    "level": 10,
    "xp_required": 3162,
    "acc_xp_required": 14168,
    "additional_requirements": {
      "stats": {
        "count": 4,
        "min_level": 2
      }
    }
  },
  {
    "level": 11,
    "xp_required": 3648,
    "acc_xp_required": 17816
  },
  {
    "level": 12,
    "xp_required": 4157,
    "acc_xp_required": 21973
  },
  {
    "level": 13,
    "xp_required": 4687,
    "acc_xp_required": 26660
  },
  {
    "level": 14,
    "xp_required": 5238,
    "acc_xp_required": 31898
  },
  {
    "level": 15,
    "xp_required": 5809,
    "acc_xp_required": 37707
  },
  {
    "level": 16,
    "xp_required": 6400,
    "acc_xp_required": 44107
  },
  {
    "level": 17,
    "xp_required": 7009,
    "acc_xp_required": 51116
  },
  {
    "level": 18,
    "xp_required": 7637,
    "acc_xp_required": 58753
  },
  {
    "level": 19,
    "xp_required": 8282,
    "acc_xp_required": 67035
  },
  {
    "level": 20,
    "xp_required": 8944,
    "acc_xp_required": 75979,
    "additional_requirements": {
      "stats": {
        "count": 3,
        "min_level": 3
      }
    }
  },
  {
    "level": 21,
    "xp_required": 9623,
    "acc_xp_required": 85602
  },
  {
    "level": 22,
    "xp_required": 10319,
    "acc_xp_required": 95921
  },
  {
    "level": 23,
    "xp_required": 11030,
    "acc_xp_required": 106951
  },
  {
    "level": 24,
    "xp_required": 11758,
    "acc_xp_required": 118709
  },
  {
    "level": 25,
    "xp_required": 12500,
    "acc_xp_required": 131209
  },
  {
    "level": 26,
    "xp_required": 13257,
    "acc_xp_required": 144466
  },
  {
    "level": 27,
    "xp_required": 14030,
    "acc_xp_required": 158496
  },
  {
    "level": 28,
    "xp_required": 14816,
    "acc_xp_required": 173312
  },
  {
    "level": 29,
    "xp_required": 15617,
    "acc_xp_required": 188929
  },
  {
    "level": 30,
    "xp_required": 16432,
    "acc_xp_required": 205361,
    "additional_requirements": {
      "stats": {
        "count": 4,
        "min_level": 3
      }
    }
  },
  {
    "level": 31,
    "xp_required": 17260,
    "acc_xp_required": 222621
  },
  {
    "level": 32,
    "xp_required": 18102,
    "acc_xp_required": 240723
  },
  {
    "level": 33,
    "xp_required": 18957,
    "acc_xp_required": 259680
  },
  {
    "level": 34,
    "xp_required": 19825,
    "acc_xp_required": 279505
  },
  {
    "level": 35,
    "xp_required": 20706,
    "acc_xp_required": 300211
  },
  {
    "level": 36,
    "xp_required": 21600,
    "acc_xp_required": 321811
  },
  {
    "level": 37,
    "xp_required": 22506,
    "acc_xp_required": 344317
  },
  {
    "level": 38,
    "xp_required": 23425,
    "acc_xp_required": 367742
  },
  {
    "level": 39,
    "xp_required": 24355,
    "acc_xp_required": 392097
  },
  {
    "level": 40,
    "xp_required": 25298,
    "acc_xp_required": 417395,
    "additional_requirements": {
      "stats": {
        "count": 3,
        "min_level": 5
      }
    }
  },
  {
    "level": 41,
    "xp_required": 26253,
    "acc_xp_required": 443648
  },
  {
    "level": 42,
    "xp_required": 27219,
    "acc_xp_required": 470867
  },
  {
    "level": 43,
    "xp_required": 28197,
    "acc_xp_required": 499064
  },
  {
    "level": 44,
    "xp_required": 29186,
    "acc_xp_required": 528250
  },
  {
    "level": 45,
    "xp_required": 30187,
    "acc_xp_required": 558437
  },
  {
    "level": 46,
    "xp_required": 31199,
    "acc_xp_required": 589636
  },
  {
    "level": 47,
    "xp_required": 32222,
    "acc_xp_required": 621858
  },
  {
    "level": 48,
    "xp_required": 33255,
    "acc_xp_required": 655113
  },
  {
    "level": 49,
    "xp_required": 34300,
    "acc_xp_required": 689413
  },
  {
    "level": 50,
    "xp_required": 35355,
    "acc_xp_required": 724768,
    "additional_requirements": {
      "stats": {
        "count": 5,
        "min_level": 5
      }
    }
  }
];

module.exports = { levelUpRules };