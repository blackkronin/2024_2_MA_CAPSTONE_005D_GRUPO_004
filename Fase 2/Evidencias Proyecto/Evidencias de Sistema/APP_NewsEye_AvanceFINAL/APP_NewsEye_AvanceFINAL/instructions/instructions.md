# Vista general del proyecto
Estas creando una plataforma que busca conectar a los usuarios a información relevante orientada a sus intereses, el usuario puede crear una cuenta y configurar su perfil con sus datos personales (fecha de nacimiento, nombre, etc), intereses, ocupación, nivel de estudios, etc. Tendrán la posibilidad de conversar con una IA para que les ayude a generar informes, reportes y contenido que puedan compartir, en un apartado de comunidad podrán ver contenido creado por otros usuarios y se podrán seguir, se recomendarán personas que tengan sus mismos intereses.

Para esto usaras Next JS-14, shadcn, tailwind, Lucid icon, React.

# Funcionalidades principales
1. Traer datos de noticias y articulos de información
    1.1 Uso de News API
    1.2 Los usuarios podrán ver noticias y articulos relevantes basado en sus intereses siempre y cuando estén registrados en la plataforma, los articulos y noticias se verán en formato cards.
    1.3 Clickeando en un articulo se podrá visualizar el articulo en una pagina de detalle.
    1.4 En la página de detalle del articulo, se podrá clickear en un boton para llevarlo como referencia a la IA.
2. Panel de IA
    2.1 Se podrá generar contenido utilizando la IA de OpenAI, basado en el modelo de o1, que se utiliza para crear agentes.
    2.2 Se podrá visualizar el proceso de generación del contenido.
    2.3 Se podrá previsualizar el contenido antes de guardarlo en el sistema.
    2.4 Se podrá almacenar el contenido generado en el perfil del usuario.
    2.5 Se podrá visualizar el historial de consultas del usuario.
    2.6 Se podrá crear un nuevo chat.
    2.7 Se podrá almacenar el contenido de la respuesta en un repositorio de contenido.
3. Sistema de recomendación de usuarios
    3.1 Se podrán recomendar usuarios a través de la página de perfil de usuario.
    3.2 Se podrán visualizar los posts de los usuarios recomendados en la página de comunidad que tengan alta calidad.
4. Sistema de comunidad
    4.1 Clickeando en el panel de comunidad deberían aparecer los posts de las personas que el usuario sigue.
    4.2 Dentro de la página de comunidad deberán aparecer 2 tabs "Publicaciones" y "Temas", en publicaciones se visualizaran los posts de otros usuarios junto con su popularidad, cantidad de comentarios y catergoria.
5. Analizar contenidos
    5.1 Por cada post se tendrá un análisis para diversificar las categorías de posts de la comunidad, guardando el contenido en categorías como: Política, Economía, Salud, etc. En "Temas". Utilizando OpenAI structured output.
6. Procesar nueva información
    6.1 Al momento de crear un nuevo post, se procesará la información para su posterior análisis en "Temas".
    6.2 Al momento de crear un nuevo post, se analizará el contenido de su popularidad, cantidad de comentarios y categoria en "Publicaciones".


# Documentación para traer las noticias al index

EJEMPLO DE CÓDIGO

```
const axios = require('axios'); // Change to CommonJS syntax

const API_KEY = 'c9eda70565b646d38e6ecdf2890392e3'; // Reemplaza con tu clave de API

async function fetchPopularNews() {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                country: 'us', // Cambia el país según sea necesario
                apiKey: API_KEY,
                sortBy: 'popularity'
            }
        });
        console.log(response.data.articles); // Muestra las noticias populares
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Command-line test to fetch and display news
if (require.main === module) {
    fetchPopularNews();
}
```
RESULTADO ESPERADO
```
[
  {
    source: { id: 'the-washington-post', name: 'The Washington Post' },
    author: 'Mark Maske',
    title: 'Steelers plan to start Russell Wilson at quarterback Sunday against Jets - The Washington Post',
    description: 'Veteran Russell Wilson is set to make his first Steelers start after they went 4-2 with Justin Fields filling in.',
    url: 'https://www.washingtonpost.com/sports/2024/10/19/russell-wilson-starting-steelers/',
    urlToImage: 'https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/CBMILDPV2ZDXHJ2IKZTO47DWL4_size-normalized.jpg&w=1440',
    publishedAt: '2024-10-19T20:44:37Z',
    content: 'The Pittsburgh Steelers plan to start Russell Wilson at quarterback Sunday night at home against the New York Jets, two people familiar with the 
deliberations confirmed Saturday.\r\n' +
      'Wilson is set to ma… [+1829 chars]'
  },
  {
    source: { id: 'associated-press', name: 'Associated Press' },
    author: 'CHRIS MEGERIAN',
    title: 'Harris and Lizzo praise Detroit — in contrast to Trump — ahead of an Atlanta rally with Usher - The Associated Press',
    description: 'Vice President Kamala Harris has appeared with Lizzo in the signer’s hometown of Detroit, marking the beginning of in-person voting and lavishing the city with praise after Republican nominee Donald Trump recently disparaged it. Marking the first day of early…',
    url: 'https://apnews.com/article/harris-lizzo-usher-michigan-georgia-early-voting-bce7d9172df6a83cf40a35e00ddb1604',
    urlToImage: 'https://dims.apnews.com/dims4/default/f578c0d/2147483647/strip/true/crop/5616x3159+0+293/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F6e%2F5b%2F7bb3ad644d9e9c150ec14124a6a4%2F6665a8e8ab3942e5a7c0150a8a22dc29',
    publishedAt: '2024-10-19T20:13:00Z',
    content: 'DETROIT (AP) Vice President Kamala Harris appeared with Lizzo on Saturday in the singers hometown of Detroit, marking the beginning of in-person 
voting and lavishing the city with praise after Republ… [+4240 chars]'
  },
  {
    source: { id: null, name: 'BBC News' },
    author: null,
    title: 'Netanyahu undeterred after reported drone attack on his home - BBC.com',
    description: 'Israeli Prime Minister Benjamin Netanyahu said it was a failed attempt by Hezbollah to assassinate him.',
    url: 'https://www.bbc.com/news/articles/cwyl4e7w2e7o',
    urlToImage: 'https://ichef.bbci.co.uk/news/1024/branded_news/2da0/live/111672f0-8e4b-11ef-8472-27b5587d5bc5.jpg',
    publishedAt: '2024-10-19T19:39:31Z',
    content: `Israeli Prime Minister Benjamin Netanyahu has said he is undeterred from his war aims following a reported drone attack on his private residence, warning that "anyone who tries to harm Israel's citiz… [+1235 chars]`
  },
  {
    source: { id: null, name: 'KSL.com' },
    author: 'Sam Tupper, CNN',
    title: 'Whooping cough cases have exploded since 2023, new CDC data shows - KSL.com',
    description: 'Whooping cough cases are continuing to rise in the United States, with new data from the U.S. Centers for Disease Control and Prevention showing that there are five times as many cases this year than at this point last year.',
    url: 'https://www.ksl.com/article/51157966/whooping-cough-cases-have-exploded-since-2023-new-cdc-data-shows',
    urlToImage: 'https://img.ksl.com/slc/3018/301888/30188894.jpg?filter=kslv2/responsive_story_lg',
    publishedAt: '2024-10-19T19:21:33Z',
    content: 'WASHINGTON Whooping cough cases are continuing to rise in the United States, with new data from the U.S. Centers for Disease Control and Prevention showing that there are five times as many cases thi… [+2089 chars]'
  },
  {
    source: { id: null, name: 'New York Post' },
    author: 'Katherine Donlevy',
    title: 'Ukraine warns 11K North Korean troops ‘ready to fight’ alongside Russia - New York Post ',
    description: 'A video shared by Ukrainian officials shows dozens of North Korean soldiers in line to pick up bags, clothes and other apparel from Russian servicemen.',
    url: 'https://nypost.com/2024/10/19/world-news/11k-n-korean-troops-ready-to-fight-with-russia-ukraine/',
    urlToImage: 'https://nypost.com/wp-content/uploads/sites/2/2024/10/image-provided-third-party-reuters-91945308.jpg?quality=75&strip=all&w=1024',
    publishedAt: '2024-10-19T19:17:00Z',
    content: 'Concerns North Korea is gearing up to join Russia’s invasion of Ukraine reached a fever pitch Saturday, with the Ukrainian military intelligence 
boss warning that 11,000 of the Hermit Kingdom’s troop… [+4549 chars]'
  },
  {
    source: { id: null, name: 'CBS Sports' },
    author: '',
    title: 'Alabama vs. Tennessee live stream, where to watch, TV channel, prediction, pick, football game odds, spread - CBS Sports',
    description: 'Alabama travels to Tennessee for a critical SEC game.',
    url: 'https://www.cbssports.com/college-football/news/alabama-vs-tennessee-live-stream-where-to-watch-tv-channel-prediction-pick-football-game-odds-spread/',
    urlToImage: 'https://sportshub.cbsistatic.com/i/r/2024/10/17/f1d61da3-132d-437c-baa9-39929b2ef85e/thumbnail/1200x675/33d841c1dd819bada79f494e9ea6343d/milroe-scores-1.jpg',
    publishedAt: '2024-10-19T19:17:00Z',
    content: "This year's edition of the Third Saturday in October rivalry feels like a College Football Playoff eliminator. No. 7 Alabama (5-1) and No. 11 Tennessee (5-1) are both coming off stressful wins preced… [+4467 chars]"
  },
  {
    source: { id: 'cnn', name: 'CNN' },
    author: 'Katie Bo Lillis, Ivana Kottasová, MJ Lee, Kevin Liptak, Mostafa Salem',
    title: 'Killing Sinwar: A chance encounter after a yearlong manhunt for the head of Hamas - CNN',
    description: 'It was around 5:30 in the morning on Thursday in Washington, DC, when senior US officials first got word — and photographs — from their Israeli counterparts: Hamas leader Yahya Sinwar might be dead.',
    url: 'https://www.cnn.com/2024/10/19/politics/sinwar-hamas-manhunt-death/index.html',
    urlToImage: 'https://media.cnn.com/api/v1/images/stellar/prod/c-ap24291483511596.jpg?c=16x9&q=w_800,c_fill',
    publishedAt: '2024-10-19T19:08:00Z',
    content: 'It was around 5:30 in the morning on Thursday in Washington, DC, when senior US officials first got word and photographs from their Israeli counterparts: Hamas leader Yahya Sinwar might be dead.\r\n' +
      'For… [+7687 chars]'
  },
  {
    source: { id: 'cbs-news', name: 'CBS News' },
    author: null,
    title: 'Hurricane Oscar forms off the Bahamas - CBS News',
    description: 'Hurricane Oscar, which the hurricane center characterized as "tiny," formed Saturday off the coast of the Bahamas.',
    url: 'https://www.cbsnews.com/news/hurricane-oscar-forms-off-bahamas-coast/',
    urlToImage: 'https://assets2.cbsnewsstatic.com/hub/i/r/2024/10/19/91207e7d-ad48-40ff-9851-b77b7e91af84/thumbnail/1200x630/54809f972b653a7665a1b28cc56a0f54/screen-shot-2024-10-19-at-2-45-46-pm.png?v=edba3a63b5392b4c81ae19d894992d91',
    publishedAt: '2024-10-19T18:57:34Z',
    content: 'The National Hurricane Center in Miami says Hurricane Oscar has formed off the coast of the Bahamas.\r\n' +
      'Oscar, which the hurricane center characterized as "tiny," formed Saturday. Oscar – the 15th name… [+1712 chars]'
  },
  {
    source: { id: null, name: 'Oaklandside.org' },
    author: 'Callie Rhoades',
    title: 'Keller Fire evacuations: What you need to know - The Oaklandside',
    description: 'How do I check if my house is still in an evacuation zone? When can I go home? Is it safe to return to my home if it’s no longer in an evacuation zone?',
    url: 'http://oaklandside.org/2024/10/19/keller-fire-evacuations-what-you-need-to-know/',
    urlToImage: 'https://oaklandside.org/wp-content/uploads/2024/10/large-Kellerfire_EG_10.jpg',
    publishedAt: '2024-10-19T18:41:22Z',
    content: 'Never miss a story.Sign up for The Oaklandsides free daily newsletter.\r\n' +
      'Oakland Hills residents near Keller Avenue started receiving mandatory evacuation orders early yesterday afternoon. A vegetatio… [+4270 chars]'
  },
  {
    source: { id: 'axios', name: 'Axios' },
    author: 'Barak Ravid',
    title: "Pro-Iranian account leaks alleged U.S. intel on Israel's attack plans - Axios",
    description: 'U.S. officials are extremely concerned.',
    url: 'https://www.axios.com/2024/10/19/israel-iran-attack-telegram-leaked-intelligence',
    urlToImage: 'https://images.axios.com/WdLUcjRLeJX2agOJWuWMMVY_K1c=/0x504:5184x3420/1366x768/2024/10/19/1729359040253.jpg',
    publishedAt: '2024-10-19T18:35:07Z',
    content: "U.S. officials are extremely concerned about a potentially major security breach after two alleged U.S. intelligence documents about Israel's preparations for an attack on Iran were published by a Te… [+2550 chars]"
  },
  {
    source: { id: 'abc-news', name: 'ABC News' },
    author: 'ABC News',
    title: 'Over 15 million under fire weather alerts in California amid dry, windy conditions - ABC News',
    description: null,
    url: 'https://abcnews.go.com/US/15-million-fire-weather-alerts-california-amid-dry/story?id\\\\u003d114957333',
    urlToImage: null,
    publishedAt: '2024-10-19T18:18:37Z',
    content: null
  },
  {
    source: { id: null, name: 'Rolling Stone' },
    author: 'Daniel Kreps',
    title: 'Zayn Malik Postpones U.S. Tour After ‘Heartbreaking Loss’ of Liam Payne - Rolling Stone',
    description: 'Zayn Malik has postponed his U.S. tour — scheduled to begin next week — following the death of his former One Direction band mate Liam Payne.',
    url: 'http://www.rollingstone.com/music/music-news/zayn-malik-postpones-u-s-tour-liam-payne-death-1235138074/',
    urlToImage: 'https://www.rollingstone.com/wp-content/uploads/2024/10/GettyImages-2153508124.jpg?w=1600&h=900&crop=1',
    publishedAt: '2024-10-19T18:03:36Z',
    content: 'Zayn Malik has postponed his U.S. tour — which was scheduled to begin next week — following the death of his former One Direction band mate Liam 
Payne.\r\n' +
      '“Given the heartbreaking loss experienced this… [+2274 chars]'
  },
  {
    source: { id: null, name: 'Fox 59' },
    author: 'Matt Adams, Russ McQuaid',
    title: 'Delphi murders: Day 2 testimony includes former Delphi police chief, members of search party - FOX 59 Indianapolis',
    description: 'DELPHI, Ind. — Delphi’s former police chief and two people who searched for Abby Williams and Libby German in 2017 testified Saturday in the 
Delphi murders trial. While Friday’s testimony primarily included insights from the girls’ families, Saturday’s sessio…',
    url: 'https://fox59.com/delphi-trial/delphi-murders-day-2-testimony-includes-former-delphi-police-chief-members-of-search-party/',
    urlToImage: 'https://fox59.com/wp-content/uploads/sites/21/2024/10/Delphi-Broll-ININDOF1ENC001_1_mxf_00.02.29.52.jpg?w=1280',
    publishedAt: '2024-10-19T17:06:55Z',
    content: 'DELPHI, Ind. — Delphi’s former police chief and two people who searched for Abby Williams and Libby German in 2017 testified Saturday in the Delphi murders trial.\r\n' +
      'While Friday’s testimony primarily … [+3146 chars]'
  },
  {
    source: { id: 'cnn', name: 'CNN' },
    author: 'Chris Isidore',
    title: 'Tentative deal announced to end Boeing strike - CNN',
    description: 'A tentative deal has been reached to end the five-week-long strike at troubled aircraft maker Boeing, the union announced to its 33,000 striking members early Saturday.',
    url: 'https://www.cnn.com/2024/10/19/business/boeing-deal-to-end-strike/index.html',
    urlToImage: 'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2171699212-copy.jpg?c=16x9&q=w_800,c_fill',
    publishedAt: '2024-10-19T16:49:00Z',
    content: 'A tentative deal has been reached to end the five-week-long strike at troubled aircraft maker Boeing, the union announced to its 33,000 striking 
members early Saturday.\r\n' +
      'The deal still needs to be ra… [+5261 chars]'
  },
  {
    source: { id: null, name: 'Hollywood Reporter' },
    author: 'Pamela McClintock',
    title: 'Box Office: ‘Smile 2’ Grinning With $23M Opening, ‘Anora’ Jolts Awards Race Awake - Hollywood Reporter',
    description: "Paramount's horror-thriller sequel is easily set to win the weekend but still has to contend with competition from indie slasher pic 'Terrifier 3.'",
    url: 'http://www.hollywoodreporter.com/movies/movie-news/smile-2-box-office-opening-1236035748/',
    urlToImage: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/10/S2_FP_017-H-2024.jpg?w=1296&h=730&crop=1',
    publishedAt: '2024-10-19T16:36:13Z',
    content: 'Paramount and Temple Hill are grinning widely.\r\n' +
      'Their new movie,Smile 2, is winning the domestic box office race with an estimated $23 million after earning $9.4 million on Friday, including more tha… [+2385 chars]'
  },
  {
    source: { id: 'al-jazeera-english', name: 'Al Jazeera English' },
    author: 'Virginia Pietromarchi',
    title: 'LIVE: Israel attacks Beirut; siege of Gaza’s Jabalia enters 15th day - Al Jazeera English',
    description: 'Death toll expected to rise as Al Jazeera’s correspondent reports medics are being prevented from reaching wounded.',
    url: 'https://www.aljazeera.com/news/liveblog/2024/10/19/live-israeli-attack-kills-at-least-33-in-north-gazas-jabalia-refugee-camp',
    urlToImage: 'https://www.aljazeera.com/wp-content/uploads/2024/10/AFP__20241018__36K94QL__v3__HighRes__TopshotPalestinianIsraelConflict-1729322477.jpg?resize=1920%2C1440',
    publishedAt: '2024-10-19T15:14:47Z',
    content: 'blinking-dot\r\n' +
      'Live updatesLive updates, \r\n' +
      'At least 44 Palestinians killed and more than 80 wounded in Israeli strikes on northern Gazas Jabalia and Maghazi refugee camps.'
  },
  {
    source: { id: 'usa-today', name: 'USA Today' },
    author: 'Jay Stahl',
    title: "Liam Payne's girlfriend Kate Cassidy breaks silence on singer's death: 'At a complete loss' - USA TODAY",
    description: `Liam Payne's girlfriend Kate Cassidy broke her silence on the death of the ex-One Direction singer, saying she is at a "complete loss."`,    
    url: 'https://www.usatoday.com/story/entertainment/celebrities/2024/10/19/liam-payne-death-girlfriend-kate-cassidy-breaks-silence/75750790007/',
    urlToImage: 'https://www.usatoday.com/gcdn/authoring/authoring-images/2024/10/19/USAT/75751329007-getty-images-1245385986.jpg?crop=3999,2250,x0,y0&width=3200&height=1801&format=pjpg&auto=webp',
    publishedAt: '2024-10-19T15:03:23Z',
    content: "Liam Payne's girlfriend is breaking her silence after the late singer's death.\r\n" +
      'Kate Cassidy, a model and influencer, took to her Instagram Story on Friday to mourn the loss of the One Direction band… [+3605 chars]'
  },
  {
    source: { id: 'cnn', name: 'CNN' },
    author: 'Ashley Strickland',
    title: 'Peer inside the underwater volcanic caves where life thrives - CNN',
    description: 'This week, marvel at giant tube worms living beneath hot springs on the ocean floor, watch SpaceX catch a rocket booster, learn why humans love carbs, and more.',
    url: 'https://www.cnn.com/2024/10/19/science/subseafloor-ecosystem-science-newsletter-wt/index.html',
    urlToImage: 'https://media.cnn.com/api/v1/images/stellar/prod/fkt230629-s0552-20230713t195602z-experiments.jpg?c=16x9&q=w_800,c_fill',
    publishedAt: '2024-10-19T15:00:00Z',
    content: 'Editors note: A version of this story appeared in CNNs Wonder Theory science newsletter. To get it in your inbox, sign up for free here.\r\n' +  
      'A mile and a half beneath the oceans surface, the seafloor se… [+5403 chars]'
  },
  {
    source: { id: null, name: 'PEOPLE' },
    author: 'https://www.facebook.com/peoplemag',
    title: "Savannah Guthrie, Hoda Kotb and Jenna Bush Hager Pose in Rare Photo with Their Kids at Taylor Swift's Miami Show - AOL",
    description: "Savannah Guthrie, Hoda Kotb and Jenna Bush Hager were joined by their children — and wore some fitting Swiftie attire — as they watched Taylor Swift's latest gig at Hard Rock Stadium in Miami on Oct. 18.",
    url: 'https://people.com/savannah-guthrie-hoda-kotb-jenna-bush-hager-and-kids-rare-photo-taylor-swift-show-8731002',
    urlToImage: 'https://people.com/thmb/_Fi1EW75S520_NtGULH5eRrTqK0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(776x402:778x404)/bush-hager-kotb-guthrie-taylor-swift-instagram-tout-101924-63c0ecbb9541421b971433c0783fb68d.jpg',
    publishedAt: '2024-10-19T14:47:25Z',
    content: 'It was a multiple-family affair at the Eras Tour for Hoda Kotb, Jenna Bush Hager and Savannah Guthrie!\r\n' +
      "On Friday, Oct. 18, the Today colleagues enjoyed a night out at Taylor Swift's Eras Tour at Mia… [+3719 chars]"
  },
  {
    source: { id: null, name: 'PhoneArena' },
    author: 'Abdullah Asim',
    title: 'Samsung Galaxy S25 Ultra colors leaked, includes a titanium option - PhoneArena',
    description: 'Color options for the upcoming Samsung Galaxy S25 Ultra have just leaked, and they include a familiar option.',
    url: 'https://www.phonearena.com/news/samsung-galaxy-s25-ultra-colors-leaked-titanium-option_id163911',
    urlToImage: 'https://m-cdn.phonearena.com/images/article/163911-wide-two_1200/Samsung-Galaxy-S25-Ultra-colors-leaked-includes-a-titanium-option.jpg',      
    publishedAt: '2024-10-19T14:30:16Z',
    content: 'Renowned Samsung tipster Ice Universe has just revealed the four color options that will be available for the upcoming Galaxy S25 Ultra. One of these options includes a titanium variant which might t… [+1103 chars]'
  }
]
```
### Documentación para categorizar las noticias y agregarles su campo correspondiente a la tarjeta

Ejemplo de código
```
const axios = require('axios'); // Change to CommonJS syntax
const OpenAI = require('openai'); // Import OpenAI client
const { zodResponseFormat } = require('openai/helpers/zod');
const { z } = require('zod');

const openai = new OpenAI();

const API_KEY = 'c9eda70565b646d38e6ecdf2890392e3'; // Reemplaza con tu clave de API

// Define the type for a news article
type Article = {
    title: string;
    content?: string;
    description?: string;
    url: string;
};

async function fetchPopularNews() {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                country: 'us', // Cambia el país según sea necesario
                apiKey: API_KEY,
                sortBy: 'popularity'
            }
        });
        const articles: Article[] = response.data.articles; // Muestra las noticias populares
        const categorizedArticles = await categorizeArticles(articles);
        console.log(categorizedArticles); // Muestra las noticias categorizadas
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

async function categorizeArticles(articles: Article[]) { // Explicitly define the type of articles
    const categories = ["Tecnología", "Deporte", "Farandula", "Emergencia", "Salud"];
    const categorizedResults = [];

    for (const article of articles) {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: "Categorize the news article." },
                { role: "user", content: `Article: ${article.title}. Content: ${article.content || article.description}. Categories: ${categories.join(", ")}.` },
            ],
            response_format: zodResponseFormat(z.object({
                category: z.string(),
                isCorrect: z.boolean(),
            }), "categoryResult"),
        });

        const result = completion.choices[0].message.parsed;
        if (result.isCorrect) {
            categorizedResults.push({
                title: article.title,
                category: result.category,
                url: article.url,
            });
        }

        // Limit to 5 articles
        if (categorizedResults.length >= 5) {
            break;
        }
    }

    return categorizedResults;
}

// Command-line test to fetch and display news
if (require.main === module) {
    fetchPopularNews();
}

```
Resultado esperado
```
[
  {
    title: 'Steelers plan to start Russell Wilson at quarterback Sunday against Jets - The Washington Post',
    category: 'Deporte',
    url: 'https://www.washingtonpost.com/sports/2024/10/19/russell-wilson-starting-steelers/'
  },
  {
    title: 'Harris and Lizzo praise Detroit — in contrast to Trump — ahead of an Atlanta rally with Usher - The Associated Press',
    category: 'Farandula',
    url: 'https://apnews.com/article/harris-lizzo-usher-michigan-georgia-early-voting-bce7d9172df6a83cf40a35e00ddb1604'
  },
  {
    title: 'Netanyahu undeterred after reported drone attack on his home - BBC.com',
    category: 'Emergencia',
    url: 'https://www.bbc.com/news/articles/cwyl4e7w2e7o'
  },
  {
    title: 'Whooping cough cases have exploded since 2023, new CDC data shows - KSL.com',
    category: 'Salud',
    url: 'https://www.ksl.com/article/51157966/whooping-cough-cases-have-exploded-since-2023-new-cdc-data-shows'
  },
  {
    title: 'Ukraine warns 11K North Korean troops ‘ready to fight’ alongside Russia - New York Post ',
    category: 'Emergencia',
    url: 'https://nypost.com/2024/10/19/world-news/11k-n-korean-troops-ready-to-fight-with-russia-ukraine/'
  }
]
```
### Documentación para Scrapear la WEB a través de la API de Tavily según la Query del usuario
```
CÓDIGO DE EJEMPLO
const { tavily } = require("@tavily/core"); // Cambiar a sintaxis CommonJS
const readline = require("readline"); // Importar readline

// Instanciar el cliente Tavily
const tvly = tavily({ apiKey: "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" });

// Crear una interfaz de readline para la entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para buscar información basada en un prompt
async function searchInformation(prompt: string) { // Especificar el tipo de 'prompt'
    try {
        // Ejecutar la búsqueda utilizando la Tavily Search API
        const response = await tvly.search(prompt, { // Cambiar a pasar solo el prompt
            includeAnswer: true, // Asegurarse de incluir la respuesta
            includeImages: true, // Incluir imágenes si es necesario
            maxResults: 5 // Puedes ajustar el número de resultados
        });

        // Imprimir el resultado en la consola
        console.log("Resultados de la búsqueda:");
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error al buscar información:", error);
    }
}

// Solicitar al usuario que ingrese su búsqueda
rl.question("Ingresa tu búsqueda: ", (userPrompt: string) => { // Especificar el tipo de 'userPrompt'
    if (userPrompt) {
        searchInformation(userPrompt);
    } else {
        console.log("No se ingresó ninguna búsqueda.");
    }
    rl.close(); // Cerrar la interfaz de readline
});
```
RESULTADO ESPERADO
```
Ingresa tu búsqueda: Quien fundó Chile
Resultados de la búsqueda:
{
  "query": "Quien fundó Chile",
  "responseTime": 2.63,
  "images": [
    {
      "url": "https://curiosfera-historia.com/wp-content/uploads/quien-fundo-Santiago-de-Chile-300x200.jpg"
    },
    {
      "url": "https://www.mdzol.com/u/fotografias/m/2021/3/13/f768x1-1030336_1030463_142.jpg"
    },
    {
      "url": "https://3.bp.blogspot.com/-FABD4xhgbBQ/UwuSbPK3myI/AAAAAAAALUI/3BlLqxNt0sk/s1600/fundacionsantiagopedrodevaldivia.jpg"
    },
    {
      "url": "https://i.pinimg.com/originals/84/94/c8/8494c838053fb51b8fe83b22f21d495f.jpg"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/7/79/Los_Fundadores_de_Chile.jpg"
    }
  ],
  "results": [
    {
      "title": "Historia de Chile - Wikipedia, la enciclopedia libre",
      "url": "https://es.wikipedia.org/wiki/Historia_de_Chile",
      "content": "Historia de Chile. Los denominados «fundadores» de la república (de izq. a der.): José Miguel Carrera, Bernardo O'Higgins, José de San Martín y Diego Portales; óleo de 1854 de Otto Grashof. La historia de Chile se divide generalmente en doce periodos que abarcan desde el comienzo del poblamiento humano del territorio actual de Chile",
      "rawContent": null,
      "score": 0.9968149
    },
    {
      "title": "Breve Historia de Chile - LaHistoria",
      "url": "https://lahistoria.info/breve-historia-de-chile/",
      "content": "El primer europeo en llegar a Chile fue Diego de Almagro en 1535. Sin embargo, fue Pedro de Valdivia quien fundó la primera ciudad en Chile, 
Santiago, en 1541. Valdivia lideró una expedición desde Perú para explorar el territorio y establecer una colonia en nombre de la Corona española. La fundación de Chile no fue un proceso fácil. Los",
      "rawContent": null,
      "score": 0.9967269
    },
    {
      "title": "Historia de Santiago de Chile - LaHistoria",
      "url": "https://lahistoria.info/historia-de-santiago-de-chile/",
      "content": "¿Quién Conquistó Chile y Fundó Santiago? Descubre su Identidad Histórica. La historia de Santiago de Chile es rica y fascinante, y para entenderla en su totalidad, es necesario conocer a los personajes clave que la moldearon. Uno de esos personajes es el conquistador español Pedro de Valdivia, quien fundó la ciudad de Santiago en 1541.",
      "rawContent": null,
      "score": 0.9917163
    },
    {
      "title": "Fundación de Santiago de Chile | History Latinoamérica",
      "url": "https://www.historylatam.com/hoy-en-la-historia/fundacion-de-santiago-de-chile",
      "content": "Luego de entablar relaciones amistosas con los nativos, el 12 de febrero de 1541 funda la ciudad de Santiago del Nuevo Extremo. Desde su creación la ciudad debió hacer frente a las incursiones de tribus hostiles y casi es arrasada el 11 de septiembre de 1541 en un ataque de los indios Michimaloncos. Con la independencia de Chile en 1818, la",
      "rawContent": null,
      "score": 0.98761624
    },
    {
      "title": "FUNDACIÓN DE SANTIAGO: 467 AÑOS DE HISTORIA - Memoria Chilena ...",
      "url": "https://www.memoriachilena.gob.cl/602/w3-article-122687.html",
      "content": "La fundación de Santiago fue el primer hito importante en el proceso de colonización española de Chile. El 12 de febrero de 1541 Pedro de Valdivia escogió asentarse en el valle del río Mapocho, ya que consideró que la numerosa población indígena que allí habitaba, era demostración del provecho agrícola de sus tierras.",
      "rawContent": null,
      "score": 0.97684664
    }
  ],
  "answer": "Pedro de Valdivia fue quien fundó la primera ciudad en Chile, Santiago, en 1541."
}
```
### Documentación para generar un informe en formato JSON a partir de una búsqueda en Tavily junto con OpenAI y categorizarla
```
CODIGO DE EJEMPLO
const { tavily } = require("@tavily/core"); // Cliente Tavily
const { OpenAI } = require("openai"); // Importar OpenAI
const fs = require("fs"); // Para guardar el informe
const readline = require("readline"); // Para la entrada del usuario

// Instanciar el cliente Tavily
const tvly = tavily({ apiKey: "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" });

// Instanciar el cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Asegúrate de que la variable de entorno esté configurada
});

// Definición de tonos
const Tone: { [key: string]: string } = {
  Objective: "Objetivo (presentación imparcial y sin sesgos de hechos y hallazgos)",
  Formal: "Formal (se ajusta a los estándares académicos con un lenguaje y estructura sofisticados)",
  Analytical: "Analítico (evaluación crítica y examen detallado de datos y teorías)",
  Persuasive: "Persuasivo (convenciendo a la audiencia de un punto de vista o argumento particular)",
  Informative: "Informativo (proporcionando información clara y completa sobre un tema)",
  Explanatory: "Explicativo (aclaración de conceptos y procesos complejos)",
  Descriptive: "Descriptivo (representación detallada de fenómenos, experimentos o estudios de caso)",
  Critical: "Crítico (juzgando la validez y relevancia de la investigación y sus conclusiones)",
  Comparative: "Comparativo (contrastando diferentes teorías, datos o métodos para resaltar diferencias y similitudes)",
  Speculative: "Especulativo (explorando hipótesis y posibles implicaciones o direcciones de investigación futura)",
  Reflective: "Reflexivo (considerando el proceso de investigación y las perspectivas o experiencias personales)",
  Narrative: "Narrativo (contando una historia para ilustrar hallazgos o metodologías de investigación)",
  Humorous: "Humorístico (ligero y entretenido, generalmente para hacer el contenido más relatable)",
  Optimistic: "Optimista (resaltando hallazgos positivos y posibles beneficios)",
  Pessimistic: "Pesimista (enfocándose en limitaciones, desafíos o resultados negativos)",
};

// Función para solicitar el tono al usuario
function askForTone(userPrompt: string) {
  console.log("Seleccione el tono para el informe:");
  Object.keys(Tone).forEach((key, index) => {
    console.log(`${index + 1}. ${Tone[key]}`);
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Ingrese el número del tono deseado: ", (answer: string) => { // Especificar el tipo de 'answer'
    const toneIndex = parseInt(answer) - 1;
    if (toneIndex >= 0 && toneIndex < Object.keys(Tone).length) {
      const selectedTone = Object.keys(Tone)[toneIndex];
      rl.close();
      searchAndGenerateReport(userPrompt, selectedTone);
    } else {
      console.log("Selección inválida. Intente de nuevo.");
      rl.close();
      askForTone(userPrompt); // Volver a preguntar si la selección es inválida
    }
  });
}

// Función para buscar información y generar el informe
async function searchAndGenerateReport(userPrompt: string, selectedTone: string) {
  try {
    console.log("Iniciando la búsqueda de artículos...");
    const response = await tvly.search(userPrompt, {
      includeAnswer: true,
      includeImages: true,
      maxResults: 4,
    });
    console.log("Búsqueda completada. Artículos encontrados:", response.results.length);

    const articles = response.results.map((article: any) => ({
      title: article.title,
      url: article.url,
      content: article.content,
      images: response.images || [],
    }));

    console.log("Generando resúmenes de los artículos...");
    const combinedSummary: string[] = [];
    for (let article of articles) {
      const summary = await generateSummary(article.content, selectedTone);
      combinedSummary.push(summary);
    }
    console.log("Resúmenes generados exitosamente.");

    const finalSummary = combinedSummary.join("\n\n"); // Combinar todos los resúmenes en un solo string
    const limitedFinalSummary = limitToWords(finalSummary, 1000); // Limitar el resumen combinado a 1000 palabras

    console.log("Generando introducción...");
    const introduction = await generateIntroduction(userPrompt, selectedTone);
    console.log("Introducción generada.");

    console.log("Generando conclusión...");
    const conclusion = await generateConclusion(limitedFinalSummary, selectedTone);
    console.log("Conclusión generada.");

    // 6. Categorizar el informe
    const category = await categorizeContent(limitedFinalSummary);
    console.log("Categoría generada:", category);

    // 7. Crear el informe final con introducción, resúmenes, y conclusiones
    console.log("Generando informe final...");
    const report = generateFullReport(introduction, limitedFinalSummary, conclusion, articles, category);

    // 8. Guardar el informe en un archivo JSON
    fs.writeFileSync("informe.json", JSON.stringify(report, null, 2));
    console.log("Informe generado exitosamente: informe.json");
  } catch (error) {
    console.error("Error al buscar o generar el informe:", error);
  }
}

// Función para limitar el texto a un número específico de palabras
function limitToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "..."; // Limitar el texto y agregar "..."
}

// Función para generar resúmenes con OpenAI
async function generateSummary(articleContent: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Resume el siguiente contenido en 300 palabras con un tono ${Tone[selectedTone]} y asegúrate de que el resumen tenga un final lógico:\n\n${articleContent}` }
    ],
    max_tokens: 400,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar una introducción con OpenAI
async function generateIntroduction(userPrompt: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Genera una breve introducción para un informe sobre el siguiente tema: "${userPrompt}" con un tono ${Tone[selectedTone]} y asegúrate de que sea coherente y fluida.` }
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar conclusiones basadas en los resúmenes
async function generateConclusion(finalSummary: string, selectedTone: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Genera una conclusión basada en el siguiente resumen con un tono ${Tone[selectedTone]} y asegúrate de que tenga un final lógico:\n\n${finalSummary}` }
    ],
    max_tokens: 250,
  });

  return response.choices[0].message.content.trim();
}

// Función para categorizar el contenido
async function categorizeContent(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "user", content: `Categoriza el siguiente contenido en una de las siguientes categorías: Salud, Humor, Historia, Noticia, etc.:\n\n${content}` }
    ],
    max_tokens: 50,
  });

  return response.choices[0].message.content.trim();
}

// Función para generar el informe final en formato JSON
function generateFullReport(introduction: string, finalSummary: string, conclusion: string, articles: any[], category: string) {
  return {
    introduction,
    summary: finalSummary,
    conclusion,
    references: articles.map(article => ({
      title: article.title,
      url: article.url,
      images: article.images,
    })),
    category, // Añadir la categoría al informe
  };
}

// Iniciar el proceso preguntando por el tono
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Ingrese su consulta: ", (userPrompt: string) => {
  rl.close();
  askForTone(userPrompt); // Pasar el prompt ingresado al solicitar el tono
});
```
RESULTADO ESPERADO EN MENSAJES A MOSTRAR AL USUARIO
```
Iniciando la búsqueda de artículos...
Búsqueda completada. Artículos encontrados: 4
Generando resúmenes de los artículos...
Resúmenes generados exitosamente.
Generando introducción...
Introducción generada.
Generando conclusión...
Conclusión generada.
Categoría generada: Historia
Generando informe final...
Informe generado exitosamente: informe.json
```
RESULTADO ESPERADO EN EL ARCHIVO JSON PARA MOSTRAR EN EL NAVEGADOR COMO FORMATO DE INFORME EN APA
```
{
  "introduction": "En el vasto océano Pacífico, a miles de kilómetros de la costa más cercana, se alza solitaria la isla de Rapa Nui, también conocida como la Isla de Pascua. Este remoto rincón del mundo, conocido por sus enigmáticas estatuas moai, ha capturado la imaginación de exploradores, historiadores y científicos por generaciones. Nuestro equipo de investigación se embarcó en una travesía inspiradora, con el objetivo de desentrañar algunos de los misterios que envuelve esta isla. Armados con las herramientas más modernas de la arqueología y los métodos tradicionales de investigación, nos propusimos comprender mejor su rica historia, su cultura enigmática y las lecciones que puede ofrecernos sobre la supervivencia y adaptación humana.\n\nEste informe det",
  "summary": "En un remoto rincón del vasto y azul Océano Pacífico, se cuenta una fascinante historia sobre Rapa Nui, más conocida como Isla de Pascua. La isla, descubierta un Domingo de Pascua de 1722 por exploradores europeos, es un enigma envuelto en el misterio de sus emblemáticas estatuas gigantes: los moáis.\n\nDesde aquel primer desembarco, gente de todas partes del mundo han sentido una inquebrantable fascinación por este pedazo de tierra, considerada como \"la isla más isla\" por su incomparable aislamiento. A lo largo de los siglos, navegantes, historiadores y científicos se han aventurado en sus costas con el fin de descifrar sus secretos.\n\nEntre estos curiosos, se cuenta la historia de un grupo de investigadores que, armados de modernas herramientas y un respeto reverencial por la cultura local, llegaron a Rapa Nui con el deseo de entender mejor su pasado. Ellos excavaron cuidadosamente, estudiaron el suelo y recopilaron datos, siempre colaborando estrechamente con los habitantes de la isla, quienes eran los guardianes de las tradiciones y memorias ancestrales.\n\nLo que descubrieron fue revelador. Los análisis no solo proporcionaron datos sobre cómo y cuándo fueron construidos los moáis, sino también por qué. Más que simples estatuas, estos gigantes de piedra eran un monumento a los antiguos líderes de la isla, guardianes eternos que miraban desde el interior hacia las aldeas para proteger a sus habitantes.\n\nPero quizá el hallazgo más emocionante tenía que\n\nEn el vasto océano Pacífico, lejos de cualquier tierra continental, se encuentra una isla envuelta en misterio y belleza: Rapa Nui, conocida también como Isla de Pascua. Esta pequeña porción de tierra, que emergió de las profundidades del mar, es una cápsula del tiempo de un pueblo cuyos secretos aún susurran con el viento que acaricia sus famosas estatuas moai.\n\nHace mucho tiempo, los antiguos polinesios, guiados por las estrellas y las corrientes marinas, descubrieron esta isla, dándole forma a una cultura única, pervivida hoy en día no solo en las gigantescas esculturas de piedra, sino también en cada grano de arena y en cada hoja de palmera que adorna la isla. La inclusión de Rapa Nui como Parque Nacional y sitio del Patrimonio Mundial de la UNESCO es un reconocimiento a su valor incomparable, tanto cultural como natural.\n\nLa administración del parque, bajo la supervisión chilena desde su anexión en 1888, ha tomado grandes esfuerzos para preservar y entender mejor este legado. Arqueólogos y científicos de diversos rincones del mundo han puesto sus pies sobre la hierba seca de la isla, equipados con herramientas modernas y un profundo respeto por la sabiduría ancestral. Sus esfuerzos por descifrar aún más los misterios de las técnicas de construcción de los moai o la razón de la ubicación estratégica de las ahus, plataformas ceremoniales, ofrecen nuevas piezas en el eterno rompecabezas de la historia humana.\n\nVisitar el Par\n\nEn un rincón remoto del Pacífico Sur, más allá del infinito azul del océano, se encuentra la enigmática Isla de Pascua, conocida como Rapa Nui por sus habitantes originarios. Esta pequeña porción de tierra, perteneciente a Chile, es famosa por sus gigantescos testigos de piedra, los moai, que se erigen como guardianes de un pasado misterioso y fascinante.\n\nLa historia de estos colosales moai es contada a través de generaciones, como si los propios ancestros susurraran en el viento que acaricia la isla. Se sabe que los primeros pobladores de Rapa Nui esculpieron estas figuras como ofrendas a sus ancestros y dioses, marcando lugares de interés espiritual y secular. Cada moai fue tallado con esmero de la piedra volcánica de la isla, representando a los jefes y líderes espirituales que guiaban a la comunidad.\n\nLa construcción de estos monumentos no era tarea menor. Los isleños, con herramientas primitivas y una ingeniería rudimentaria pero efectiva, lograron transportar estas enormes figuras de piedra desde la cantera de Ranu Raraku hasta diversos lugares a lo largo de la costa. Los métodos exactos aún son debatidos por historiadores y científicos, pero algunos sugieren que los moai podrían haber sido arrastrados en trineos de madera o rodados sobre troncos, en un impresionante esfuerzo colectivo.\n\nHoy en día, casi mil moai aún desafían el tiempo, mirando hacia el interior de la isla, como si protegieran a la comunidad y\n\nEn un rincón lejano del vasto océano Pacífico, latía un misterio envuelto en la bruma del tiempo: Rapa Nui, más conocida como Isla de Pascua. Este pedazo de tierra, famoso por sus enigmáticos moais y su rica historia polinésica, ha cautivado la imaginación de viajeros y académicos por igual.\n\nCuando Sofía, una ávida exploradora y amante de las culturas antiguas, se encontraba planificando su próxima aventura, descubrió una valiosa fuente de información que sería su guía principal: la página oficial del Departamento de Turismo de la Municipalidad de Isla de Pascua. Con cada clic, se adentraba más en lo que prometía ser no solo un viaje, sino una inmersión profunda en un mundo perdido y mágico.\n\nEl sitio web describía con detalle los majestuosos moais, esas imponentes figuras de piedra que han vigilado la isla desde tiempos inmemoriales. Estas estatuas, creadas por los ancestros de los rapanui, no solo servían como obras de arte, sino también como símbolos de la autoridad y el poder espiritual que regía la isla. Sofía se imaginaba caminando entre ellos, pequeña e insignificante, capturando cada detalle con su cámara y su cuaderno de notas.\n\nLas playas de Rapa Nui también formaban parte crucial del atractivo de la isla. Playas de arenas blancas rodeadas de palmeras que se inclinaban como si saludaran al sol, y aguas cristalinas resonando con el canto de una multitud de especies mar",
  "conclusion": "inas. Sofía planeaba sumergirse en esas aguas, explorar los arrecifes de coral y quizás, encontrar restos de antiguas canoas polinesias que aún pudieran ocultarse bajo el azul intenso del Pacífico.\n\nA medida que se sumergía en la planificación, se cruzó con un artículo que hablaba de las recientes investigaciones llevadas a cabo en la isla. Científicos y arqueólogos, en colaboración con los nativos de la isla, habían comenzado a descifrar algunos de los enigmas que rodeaban a los moáis. Los estudios revelaban que los moáis eran mucho más que simples estatuas; eran representaciones de los ancestros de la tribu, colocados estratégicamente para maximizar su visibilidad a lo largo de la isla, como guardianes de sus descendientes y observadores silenciosos de la tierra que una vez gobernaron. \n\nEmpapada de esta nueva comprensión, Sofía comprendió que cada paso que daría en Rapa Nui sería sobre tierra",
  "references": [
    {
      "title": "Isla de Pascua - Rapa Nui | Guía imprescindible de viaje",
      "url": "https://imaginarapanui.com/",
      "images": [
        {
          "url": "https://vacacionesenamerica.com/wp-content/uploads/2020/08/8597862565_1ce54d5029_b.jpg"
        },
        {
          "url": "https://i0.wp.com/imaginarapanui.com/en/wp-content/uploads/2020/05/Easter-Island-aereal-view-Rapa-Nui-Home.jpg?resize=900,506&ssl=1"
        },
        {
          "url": "https://www.chileandtravelmagazine.com/wp-content/uploads/2017/11/Parque-nacional-rapa-nui-web-900-600.jpg"
        },
        {
          "url": "https://s-media-cache-ak0.pinimg.com/originals/8c/ef/06/8cef0695c888d041d03c6cb0d3cefd1f.jpg"
        },
        {
          "url": "https://lp-cms-production.imgix.net/2019-06/89621247.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
        }
      ]
    },
    {
      "title": "Rapa Nui National Park - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Rapa_Nui_National_Park",
      "images": [
        {
          "url": "https://vacacionesenamerica.com/wp-content/uploads/2020/08/8597862565_1ce54d5029_b.jpg"
        },
        {
          "url": "https://i0.wp.com/imaginarapanui.com/en/wp-content/uploads/2020/05/Easter-Island-aereal-view-Rapa-Nui-Home.jpg?resize=900,506&ssl=1"
        },
        {
          "url": "https://www.chileandtravelmagazine.com/wp-content/uploads/2017/11/Parque-nacional-rapa-nui-web-900-600.jpg"
        },
        {
          "url": "https://s-media-cache-ak0.pinimg.com/originals/8c/ef/06/8cef0695c888d041d03c6cb0d3cefd1f.jpg"
        },
        {
          "url": "https://lp-cms-production.imgix.net/2019-06/89621247.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
        }
      ]
    },
    {
      "title": "Easter Island - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Easter_Island",
      "images": [
        {
          "url": "https://vacacionesenamerica.com/wp-content/uploads/2020/08/8597862565_1ce54d5029_b.jpg"
        },
        {
          "url": "https://i0.wp.com/imaginarapanui.com/en/wp-content/uploads/2020/05/Easter-Island-aereal-view-Rapa-Nui-Home.jpg?resize=900,506&ssl=1"
        },
        {
          "url": "https://www.chileandtravelmagazine.com/wp-content/uploads/2017/11/Parque-nacional-rapa-nui-web-900-600.jpg"
        },
        {
          "url": "https://s-media-cache-ak0.pinimg.com/originals/8c/ef/06/8cef0695c888d041d03c6cb0d3cefd1f.jpg"
        },
        {
          "url": "https://lp-cms-production.imgix.net/2019-06/89621247.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
        }
      ]
    },
    {
      "title": "Turismo Rapa Nui - Turismo Rapa Nui: Descubre la Isla de Pascua con la ...",
      "url": "https://www.turismo-rapanui.com/",
      "images": [
        {
          "url": "https://vacacionesenamerica.com/wp-content/uploads/2020/08/8597862565_1ce54d5029_b.jpg"
        },
        {
          "url": "https://i0.wp.com/imaginarapanui.com/en/wp-content/uploads/2020/05/Easter-Island-aereal-view-Rapa-Nui-Home.jpg?resize=900,506&ssl=1"
        },
        {
          "url": "https://www.chileandtravelmagazine.com/wp-content/uploads/2017/11/Parque-nacional-rapa-nui-web-900-600.jpg"
        },
        {
          "url": "https://s-media-cache-ak0.pinimg.com/originals/8c/ef/06/8cef0695c888d041d03c6cb0d3cefd1f.jpg"
        },
        {
          "url": "https://lp-cms-production.imgix.net/2019-06/89621247.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
        }
      ]
    }
  ],
  "category": "Historia"
}  
```
### Documentación para generar proceso de cuentas de usuario, registro de usuario, login de usuario, logout de usuario, recuperación de contraseña y cambio de contraseña, cambio de datos de perfil básicos (nombre, email, teléfono, foto de perfil, intereses, etc)
```
EJEMPLO DE CREACIÓN DE CUENTA DE USUARIO
import { useState } from 'react';
import { supabase } from '../supabaseClient';

const careers = [
  "Administración de Empresas",
  "Ingeniería en Sistemas Computacionales",
  "Ingeniería en Software",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Ingeniería Electrónica",
  "Ingeniería Biomédica",
  "Ingeniería Aeroespacial",
  "Ingeniería Ambiental",
  "Ingeniería Química",
  "Ingeniería Petrolera",
  "Ingeniería en Telecomunicaciones",
  "Ingeniería en Robótica",
  "Arquitectura",
  "Diseño Gráfico",
  "Diseño de Interiores",
  "Diseño Industrial",
  "Medicina",
  "Enfermería",
  "Odontología",
  "Veterinaria",
  "Biología",
  "Bioquímica",
  "Biotecnología",
  "Física",
  "Química",
  "Matemáticas",
  "Estadística",
  "Economía",
  "Contaduría Pública",
  "Finanzas",
  "Mercadotecnia",
  "Publicidad",
  "Ciencias Políticas",
  "Relaciones Internacionales",
  "Derecho",
  "Criminología",
  "Psicología",
  "Pedagogía",
  "Filosofía",
  "Sociología",
  "Antropología",
  "Historia",
  "Geografía",
  "Trabajo Social",
  "Comunicación Social",
  "Periodismo",
  "Producción Audiovisual",
  "Cine",
  "Música",
  "Artes Visuales",
  "Artes Escénicas",
  "Danza",
  "Literatura",
  "Lenguas Extranjeras",
  "Lingüística",
  "Educación Física",
  "Ciencias del Deporte",
  "Nutrición",
  "Gastronomía",
  "Turismo",
  "Hotelería",
  "Logística y Cadena de Suministro",
  "Ingeniería en Transporte",
  "Ingeniería Agrónoma",
  "Agricultura",
  "Forestal",
  "Ciencias Ambientales",
  "Oceanografía",
  "Geología",
  "Minería",
  "Ciencias Actuariales",
  "Ingeniería de Datos",
  "Ciberseguridad",
  "Big Data",
  "Inteligencia Artificial",
  "Desarrollo de Videojuegos",
  "Animación Digital",
  "Producción Musical",
  "Derecho Penal",
  "Derecho Civil",
  "Derecho Corporativo",
  "Derecho Laboral",
  "Derecho Internacional",
  "Arquitectura de Software",
  "Ingeniería de Redes",
  "Ciencia de Datos",
  "Bioinformática",
  "Neurociencia",
  "Genética",
  "Fisioterapia",
  "Ingeniería en Energías Renovables",
  "Meteorología",
  "Toxicología",
  "Farmacología",
  "Nanotecnología",
  "Tecnología de Alimentos",
  "Ingeniería de Materiales",
  "Optometría",
  "Investigación Forense",
  "Seguridad y Salud Ocupacional",
  "Educación Especial",
  "Terapia Ocupacional",
  "Terapia del Lenguaje",
  "Publicidad Digital",
  "Comunicación Corporativa",
  "Desarrollo de Aplicaciones Móviles",
  "Diseño Web",
  "Tecnologías de la Información y Comunicación",
  "Gestión de Proyectos",
  "Gestión de Recursos Humanos",
  "Gestión Pública",
  "Ingeniería Marítima",
  "Ingeniería Hidráulica",
  "Psicopedagogía",
  "Astronomía",
  "Ingeniería Mecatrónica",
  "Criptografía",
  "Economía Internacional",
  "Relaciones Públicas",
  "Medicina Deportiva",
  "Ingeniería en Nanomateriales",
  "Desarrollo Sostenible",
  "Teología",
  "Política y Gobernanza",
  "Biblioteconomía",
  "Periodismo Deportivo",
  "Estudios de Género"
];

const interests = [
  "Cocina",
  "Noticias",
  "Historia",
  "Ciencia",
  "Tecnología",
  "Deportes",
  "Salud",
  "Economía",
  "Política",
  "Arte",
  "Música",
  "Cine",
  "Literatura",
  "Viajes",
  "Gastronomía",
  "Moda",
  "Fotografía",
  "Medicina",
  "Educación",
  "Psicología",
  "Astronomía",
  "Ecología",
  "Filosofía",
  "Religión",
  "Cultura",
  "Emprendimiento",
  "Ciberseguridad",
  "Innovación",
  "Inteligencia Artificial",
  "Videojuegos",
  "Marketing Digital",
  "Finanzas",
  "Bienestar",
  "Criptomonedas",
  "Blockchain",
  "Programación",
  "Robótica",
  "Automóviles",
  "Redes Sociales",
  "Fotoperiodismo",
  "Clima",
  "Derecho",
  "Fotografía Digital",
  "Ficción",
  "Misterios",
  "Terror",
  "Economía Global",
  "Activismo Social",
  "Energías Renovables",
  "Urbanismo",
  "Biotecnología",
  "Sostenibilidad",
  "Educación Financiera",
  "Humanidades",
  "Psicología Positiva",
  "Desarrollo Personal",
  "Medio Ambiente",
  "Futurología",
  "Tendencias",
  "Neurociencia",
  "Arquitectura",
  "Diseño",
  "Jardinería",
  "Fotografía Analógica",
  "Ciencias Políticas",
  "Redacción Creativa",
  "Narrativa Visual",
  "Eventos Globales",
  "Agricultura",
  "Moda Sostenible",
  "Realidad Virtual",
  "Realidad Aumentada",
  "Automatización",
  "Gestión de Proyectos",
  "Desarrollo Urbano",
  "Comercio Internacional",
  "Estudios de Género",
  "Inclusión Social",
  "Comunicación",
  "Arqueología",
  "Antropología",
  "Derechos Humanos",
  "Cultura Pop",
  "Biodiversidad",
  "Diseño Web",
  "Mitología",
  "Ciencia Ficción",
  "Educación Infantil",
  "Gestión del Tiempo",
  "Estudios Culturales",
  "Espectáculos",
  "Desarrollo de Software",
  "Seguridad Informática",
  "Política Internacional",
  "Fotografía Documental",
  "Economía Circular",
  "Publicidad",
  "Educación Online",
  "Estudios del Cine",
  "Escritura Técnica"
];

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [birthdate, setBirthdate] = useState('');
  const [education, setEducation] = useState('');
  const [career, setCareer] = useState('');
  const [profession, setProfession] = useState('');
  const [retired, setRetired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermInterests, setSearchTermInterests] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      data: {
        name,
        username,
        interests: selectedInterests,
        birthdate,
        education,
        career,
        profession,
        retired,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Te has registrado correctamente. Revisa tu email para confirmar.');
    }
  };

  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const filteredCareers = careers.filter(careerOption =>
    careerOption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInterests = interests.filter(interestOption =>
    interestOption.toLowerCase().includes(searchTermInterests.toLowerCase())
  );

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div>
          <h3>Intereses</h3>
          <input
            type="text"
            placeholder="Buscar intereses"
            value={searchTermInterests}
            onChange={(e) => setSearchTermInterests(e.target.value)}
          />
          {filteredInterests.map((interest) => (
            <label key={interest}>
              <input
                type="checkbox"
                checked={selectedInterests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
              />
              {interest}
            </label>
          ))}
        </div>
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <select value={education} onChange={(e) => setEducation(e.target.value)} required>
          <option value="">Selecciona tu educación</option>
          <option value="basica">Básica</option>
          <option value="media">Media</option>
          <option value="universitaria">Universitaria</option>
        </select>
        {education === 'universitaria' && (
          <>
            <input
              type="text"
              placeholder="Buscar carrera"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={career} onChange={(e) => setCareer(e.target.value)} required>
              <option value="">Selecciona tu carrera</option>
              {filteredCareers.map((careerOption) => (
                <option key={careerOption} value={careerOption}>{careerOption}</option>
              ))}
            </select>
          </>
        )}
        {education !== 'basica' && (
          <input
            type="text"
            placeholder="Profesión"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
        )}
        <label>
          <input
            type="checkbox"
            checked={retired}
            onChange={() => setRetired(!retired)}
          />
          ¿Estás jubilado?
        </label>
        <button type="submit">Registrarse</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
```
EJEMPLO DE EDITAR PERFIL DE USUARIO
```
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', username: '', email: '', interests: [], birthdate: '', education: '', career: '', profession: '', retired: false });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setProfile({
          name: data.user.user_metadata.name || '',
          username: data.user.user_metadata.username || '',
          email: data.user.email, // Mantener el correo electrónico, pero no permitir su edición
          interests: data.user.user_metadata.interests || [],
          birthdate: data.user.user_metadata.birthdate || '',
          education: data.user.user_metadata.education || '',
          career: data.user.user_metadata.career || '',
          profession: data.user.user_metadata.profession || '',
          retired: data.user.user_metadata.retired || false,
        });
      }
    };
    loadProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      // No enviar el correo electrónico en la actualización
      data: {
        name: profile.name,
        username: profile.username,
        interests: profile.interests,
        birthdate: profile.birthdate,
        education: profile.education,
        career: profile.career,
        profession: profile.profession,
        retired: profile.retired,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Perfil actualizado exitosamente');
      setIsEditing(false); // Salir del modo de edición
    }
  };

  return (
    <div>
      <h1>Perfil</h1>
      {isEditing ? (
        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            placeholder="Nombre"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          {/* Eliminar el campo de correo electrónico para evitar cambios */}
          <input
            type="email"
            placeholder="Email"
            value={profile.email}
            disabled // Deshabilitar el campo para que no se pueda editar
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={profile.birthdate}
            onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
          />
          <select value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })}>
            <option value="">Selecciona tu educación</option>
            <option value="basica">Básica</option>
            <option value="media">Media</option>
            <option value="universitaria">Universitaria</option>
          </select>
          {profile.education === 'universitaria' && (
            <input
              type="text"
              placeholder="Carrera"
              value={profile.career}
              onChange={(e) => setProfile({ ...profile, career: e.target.value })}
            />
          )}
          {profile.education !== 'basica' && (
            <input
              type="text"
              placeholder="Profesión"
              value={profile.profession}
              onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
            />
          )}
          <label>
            <input
              type="checkbox"
              checked={profile.retired}
              onChange={() => setProfile({ ...profile, retired: !profile.retired })}
            />
            ¿Estás jubilado?
          </label>
          <button type="submit">Actualizar perfil</button>
        </form>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Nombre de usuario:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Fecha de nacimiento:</strong> {profile.birthdate}</p>
          <p><strong>Educación:</strong> {profile.education}</p>
          <p><strong>Carrera:</strong> {profile.career}</p>
          <p><strong>Profesión:</strong> {profile.profession}</p>
          <p><strong>Jubilado:</strong> {profile.retired ? 'Sí' : 'No'}</p>
          <button onClick={() => setIsEditing(true)}>Editar perfil</button>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
```
EJEMPLO DE RECUPERAR CONTRASEÑA DE USUARIO
```
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRecover = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Hemos enviado un correo para recuperar tu contraseña.');
    }
  };

  return (
    <div>
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={handleRecover}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Recuperar contraseña</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
```
EJEMPLO DE LOGOUT DE USUARIO Y LOGIN DE USUARIO
```
LOGIN
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.push('/profile'); // Redirigir al perfil después de iniciar sesión
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
```
LOGOUT
```
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };
    logout();
  }, [router]);

  return <p>Cerrando sesión...</p>;
}
```
### Documentación para generar muestreo de informes realizados por el usuario en su perfil

### Raiz de proyecto actual
newseye-app 
├──  app
│   ├──  favicon.ico
│   ├──  fonts
│   │   ├──  GeistMonoVF.woff
│   │   └──  GeistVF.woff
│   ├──  globals.css
│   ├──  layout.tsx
│   └──  page.tsx
├──  components
│   └──  ui
│       ├──  alert-dialog.tsx
│       ├──  alert.tsx
│       ├──  avatar.tsx
│       ├──  button.tsx
│       ├──  card.tsx
│       ├──  checkbox.tsx
│       ├──  dialog.tsx
│       ├──  drawer.tsx
│       ├──  dropdown-menu.tsx
│       ├──  form.tsx
│       ├──  hover-card.tsx
│       ├──  input.tsx
│       ├──  label.tsx
│       ├──  navigation-menu.tsx
│       ├──  pagination.tsx
│       ├──  sheet.tsx
│       ├──  table.tsx
│       ├──  tabs.tsx
│       ├──  textarea.tsx
│       ├──  toast.tsx
│       └──  toaster.tsx
├──  components.json
├──  hooks
│   └──  use-toast.ts
├──  instructions
│   └──  instructions.md
├──  lib
│   └──  utils.ts
├──  next-env.d.ts
├──  next.config.mjs
├──  package-lock.json
├──  package.json
├──  postcss.config.mjs
├──  README.md
├──  tailwind.config.ts
└──  tsconfig.json