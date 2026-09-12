import { eventNames } from "process";
import { inngest } from "../client";

export const generateDeck = inngest.createFunction({
    id : "generate-deck",
    triggers : [{event:"deck/generate"}]
},
async ({event , step})=>{
    
}
)