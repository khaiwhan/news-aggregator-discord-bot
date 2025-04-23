require("dotenv").config();
const sendToDiscord = require("./utils/sendToDiscord");
const { query_async, batch_async, execute_async } = require("./utils/pg")
const { formatDuration } = require("./utils/libs")
const { randomUUID } = require("crypto")

let sources = []
let seens = []
let job_process = false

async function fetch_sources() {
  sources = [];
  (await query_async(`select platform from config where active = true order by "order"`)).forEach(f => sources.push(require(`./sources/${f["platform"]}`)));
}

async function fetch_seen() {
  seens = [];
  (await query_async(`select url_id from seen`)).forEach(f => seens.push(f["url_id"]));
}

async function run() {
  try {
    job_process = true;
    await fetch_sources();
    await fetch_seen();
    let seen = [];

    for (const source of sources) {
      const items = await source.fetch();

      for (const item of items) {

        if (!seens.includes(item.id)) {
          await sendToDiscord(item);
          seen.push(item);
          await new Promise((res) => setTimeout(res, 1100));
        }
      }
    }

    await batch_async("insert into seen(url_id, title) values(${url_id}, ${title})", seen.map(m => ({ url_id: m.id, title: m.title })))
    job_process = false;
  } catch (error) {
    console.log(error);
    job_process = false;
  }

}

run(); // run when debug

// const cron = require('node-cron');
// console.log("App Started")
// console.log(process.env.CRON_EXPRESSION)
// console.log(process.env.TZ)
// cron.schedule(process.env.CRON_EXPRESSION, async () => {
//   if (!job_process) {
//     const start_date = new Date()
//     const id = randomUUID()
//     await execute_async("insert into logs(id, start_date, status) values(${id}, ${start_date}, 'processing')", { id, start_date })
//     console.log("========================================================================================")
//     console.log("start job at ", start_date)
//     await run();
//     const finish_date = new Date()
//     const duration = finish_date - start_date;
//     const duration_format = formatDuration(duration)
//     await execute_async("update logs set finish_date=${finish_date}, duration=${duration}, duration_format=${duration_format}, status='success' where id=${id}", { id, finish_date, duration, duration_format })
//     console.log("job finish at ", finish_date)
//     console.log("Duration : ", duration_format)
//     console.log("========================================================================================")
//   }
// });