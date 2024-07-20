import articleJob from "./services/article/job.js";
import quotidienJob from "./services/quotidien/job.js";

import { topNewsFetcher } from "./services/article/topNewsFetcher.js";
import { articlesFetcher } from "./services/article/articlesFetcher.js";

await topNewsFetcher();
process.exit();
