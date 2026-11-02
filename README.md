# גלים GALIM — אתר בגדי ים

גיבוי ענן של אתר בגדי הים. הריפו הזה מכיל את קבצי האתר המלאים + היסטוריית גרסאות.

## מבנה

```
swimwear-site/
├── index.html   — עמוד האתר (HTML)
├── styles.css   — עיצוב
├── app.js       — לוגיקה: קטלוג, סינון, סל קניות
└── server.js    — שרת סטטי מקומי (Node, ללא תלויות)
```

## שחזור

אם הקבצים נמחקו מהסביבה המקורית:

1. שכפול: `git clone https://github.com/<user>/galim-swimwear-site.git`
2. הרצה: `cd swimwear-site && node server.js` (או `npm run dev`)
3. האתר יעלה על `http://localhost:3000`

## איך מתעדכן הגיבוי

אוטומציה יומית דוחפת כל שינוי לכאן (commit + push). כל שינוי נשמר כ-commit נפרד, כך שתמיד אפשר לחזור לגרסה קודמת.
