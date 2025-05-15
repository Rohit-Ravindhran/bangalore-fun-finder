// pages/add-event.js
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { supabase } from '@/integrations/supabase/client';

const CATEGORY_KEYWORDS = {
  'Outdoor': ['trek', 'camp', 'hike'],
  'Arts': ['painting', 'art', 'sketch', 'craft'],
  'Events': ['event', 'festival', 'show'],
  'Sports': ['football', 'cricket', 'run', 'marathon', 'sprint'],
  'Theatre': ['theatre', 'drama', 'play', 'improv'],
  'Unique': ['experience', 'unique', 'offbeat'],
  'Wellness': ['meditation', 'yoga', 'wellness', 'fitness', 'health'],
  'Parties': ['dj', 'party', 'club', 'dance', 'music night'],
  'Foodie': ['food', 'tasting', 'cook', 'chef', 'buffet'],
  'Trek': ['trek', 'trail', 'hiking'],
  'For Families': ['kids', 'family', 'children', 'parent', 'toddler']
};

const CATEGORY_IDS = {
  'Outdoor': '1', 'Arts': '2', 'Events': '3', 'Sports': '4',
  'Theatre': '5', 'Unique': '6', 'Wellness': '7', 'Parties': '8',
  'Foodie': '9', 'Trek': '10', 'For Families': '11'
};

function detectCategories(text) {
  const matched = new Set();
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matched.add(CATEGORY_IDS[category]);
      }
    }
  }
  return matched.size ? Array.from(matched) : ['6']; // fallback to 'Unique'
}

export default function AddEvent() {
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = () => {
    setLoading(true);
    const $ = cheerio.load(html);

    const title = $('h1.sc-7o7nez-0').first().text().trim();
    const image = $('img[src*="media-desktop-"]').first().attr('src');
    const descNodes = $('div.sc-omw9zj-1').find('p');
    const description = descNodes.map((i, el) => $(el).text().trim()).get().join(' ');
    const priceText = $('body').text().match(/₹\d+/)?.[0] || '₹0';
    const location = $('body').text().match(/Bangalore|Bengaluru/i)?.[0] || 'Bangalore';
    const dateMatch = $('body').text().match(/\d{1,2}(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
    const date = dateMatch ? dateMatch[0] : '';
    const time = $('body').text().match(/\d{1,2}:\d{2}\s*(AM|PM)/i)?.[0] || '';

    const category_ids = detectCategories(`${title} ${description}`);

    const previewData = {
      title,
      image,
      description,
      price_range: priceText,
      location,
      date,
      time,
      map_link: `https://maps.google.com/?q=${location.replace(/\s+/g, '+')}`,
      url: '',
      tags: ['Event'],
      category_ids,
      section_type: 'event',
      contact_info: '',
      enabled: true
    };

    setPreview(previewData);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setLoading(true);
    const { error } = await supabase.from('activities').insert([preview]);
    setLoading(false);
    if (error) {
      alert('Error saving to Supabase: ' + error.message);
    } else {
      alert('Event saved successfully!');
      setHtml('');
      setPreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Paste BookMyShow HTML</h1>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={15}
        className="w-full border p-2 mb-4"
        placeholder="Paste full HTML here..."
      />
      <button onClick={handlePreview} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        {loading ? 'Parsing...' : 'Preview'}
      </button>

      {preview && (
        <div className="border p-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p><strong>Title:</strong> {preview.title}</p>
          <p><strong>Date:</strong> {preview.date}</p>
          <p><strong>Time:</strong> {preview.time}</p>
          <p><strong>Location:</strong> {preview.location}</p>
          <p><strong>Price:</strong> {preview.price_range}</p>
          <p><strong>Description:</strong> {preview.description}</p>
          <p><strong>Categories:</strong> {preview.category_ids.join(', ')}</p>
          <img src={preview.image} alt="event banner" className="mt-2" />
          <button onClick={handleSubmit} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Submit to Supabase
          </button>
        </div>
      )}
    </div>
  );
}
