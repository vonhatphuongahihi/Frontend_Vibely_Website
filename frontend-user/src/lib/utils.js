import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {formatDistanceToNow, parseISO} from 'date-fns'
import {vi} from 'date-fns/locale'

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatedDate = (date) => {
  if (!date) return "";
  return formatDistanceToNow(parseISO(date), {addSuffix:true, locale:vi});
}

export const  formatDateInDDMMYYY = (date) =>{
  return new Date(date).toLocaleDateString('en-GB')
}