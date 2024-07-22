
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { title, id } = await req.json();

  const sanitizedTitle = title
  .toString()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
  .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  const url = `https://www.movieposterdb.com/${sanitizedTitle}-i${id.replaceAll('tt', '')}`;
    console.log(url);
  try {
    const response = await axios.get(url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const imgElement = document.querySelector(`img[alt="${title.replaceAll(' Of ', ' of ')}"]`);

    if (imgElement) {
        return NextResponse.json({src: imgElement.src}, {status: 200})
    } else {
        return NextResponse.json({msg: "No image found"}, {status: 500});
    }
  } catch (error) {
    return NextResponse.json({msg: error}, {status: 500});
  }
};