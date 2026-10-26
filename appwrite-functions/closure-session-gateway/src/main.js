import { Client, Databases, Query } from "node-appwrite";
import { issueAccessToken, profileFromPeopleDocument, validPinProfile } from "./policy.js";

const DATABASE = process.env.APPWRITE_DATABASE_ID || "twem_brico";
const PEOPLE = process.env.APPWRITE_PEOPLE_COLLECTION_ID || "people";
function failure(res, status, code, message) { return res.json({ ok:false, code, message }, status); }
function body(req) { if(req.bodyJson&&typeof req.bodyJson==="object")return req.bodyJson;try{return JSON.parse(req.bodyText||"{}")}catch{return{}} }
function services(){const client=new Client().setEndpoint(process.env.TWEM_APPWRITE_ENDPOINT).setProject(process.env.TWEM_APPWRITE_PROJECT_ID).setKey(process.env.TWEM_APPWRITE_API_KEY);return new Databases(client)}

export default async ({req,res,error}) => {
  try {
    const input=body(req);
    if(String(input.action||"")!=="exchangePin")return failure(res,400,"ACTION_UNKNOWN","Action inconnue.");
    const databases=services();
    const people=await databases.listDocuments(DATABASE,PEOPLE,[Query.limit(500)]);
    const name=String(input.name||"").trim();
    const profile=people.documents.map(profileFromPeopleDocument).find((entry)=>entry.name===name);
    if(!profile||!validPinProfile(profile,input.pin))return failure(res,403,"MODULE_FORBIDDEN","Cette session TWEM Brico ne donne pas accès à la clôture.");
    const actor={userId:profile.id,name:profile.name,email:profile.email,role:profile.role,sessionVersion:profile.pinCreatedAt||""};
    return res.json({ok:true,accessToken:issueAccessToken(actor,process.env.TWEM_APPWRITE_API_KEY),expiresAt:new Date(Date.now()+24*60*60*1000).toISOString(),actor:{name:actor.name,email:actor.email,role:actor.role}});
  } catch(cause){error(cause?.stack||String(cause));return failure(res,500,"SESSION_GATEWAY_ERROR","La session sécurisée n’a pas pu être créée.")}
};
