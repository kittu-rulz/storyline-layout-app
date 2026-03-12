import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, LayoutTemplate, Download, Palette, Type, Layers3 } from 'lucide-react';

const screenTypes = {
  title: {
    name: 'Title / Section Screen',
    description: 'Hero-style intro screen with title, subtitle, and CTA.',
    defaults: {
      title: 'Welcome to the Course',
      body: 'Build confidence with a clean visual introduction and a clear next step.',
      cta: 'Continue',
      layout: 'hero-center',
    },
  },
  content: {
    name: 'Content Screen',
    description: 'Structured learning screen with title, text, and media area.',
    defaults: {
      title: 'Supply Chain Visibility',
      body: 'Use this area for body copy, key learning points, or short process explanations. The layout is designed to import cleanly into Storyline as a visual guide.',
      cta: 'Next',
      layout: 'text-left-image-right',
    },
  },
  interaction: {
    name: 'Interaction Screen',
    description: 'Click-and-reveal style layout with hotspots and an information panel.',
    defaults: {
      title: 'Explore the Interface',
      body: 'Click each hotspot to learn more about the feature. This layout helps you plan an interaction before building triggers in Storyline.',
      cta: 'Explore',
      layout: 'grid-hotspots',
    },
  },
  quiz: {
    name: 'Knowledge Check',
    description: 'Question-and-options layout for quiz or checkpoint slides.',
    defaults: {
      title: 'Which statement is correct?',
      body: 'Choose the best answer based on what you just learned.',
      cta: 'Submit',
      layout: 'mcq-standard',
    },
  },
};

const themes = {
  corporate: {
    name: 'Corporate Blue',
    page: 'bg-slate-100',
    surface: 'bg-white',
    accent: 'bg-blue-600',
    accentSoft: 'bg-blue-50',
    accentText: 'text-blue-700',
    border: 'border-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  emerald: {
    name: 'Emerald',
    page: 'bg-emerald-50',
    surface: 'bg-white',
    accent: 'bg-emerald-600',
    accentSoft: 'bg-emerald-100',
    accentText: 'text-emerald-700',
    border: 'border-emerald-200',
    button: 'bg-emerald-600 hover:bg-emerald-700',
  },
  violet: {
    name: 'Violet',
    page: 'bg-violet-50',
    surface: 'bg-white',
    accent: 'bg-violet-600',
    accentSoft: 'bg-violet-100',
    accentText: 'text-violet-700',
    border: 'border-violet-200',
    button: 'bg-violet-600 hover:bg-violet-700',
  },
};

function generateSpec({ screenType, title, body, cta, theme, slideSize }) {
  const base = {
    slideSize,
    margins: '64px',
    titleFont: '32px / SemiBold',
    bodyFont: '18px / Regular',
    buttonStyle: 'Rounded rectangle, 14px radius',
    theme: themes[theme].name,
  };

  const specs = {
    title: {
      ...base,
      structure: 'Centered hero layout with title, subtitle, supporting shape, and CTA button',
      zones: ['Top progress marker', 'Center headline', 'Subhead', 'Primary CTA'],
    },
    content: {
      ...base,
      structure: 'Two-column layout with text panel on the left and visual/media panel on the right',
      zones: ['Header', 'Body content area', 'Media placeholder', 'Footer navigation'],
    },
    interaction: {
      ...base,
      structure: 'Hotspot grid with four clickable items and a detail panel below',
      zones: ['Header', 'Interactive hotspot row', 'Detail reveal area', 'Navigation controls'],
    },
    quiz: {
      ...base,
      structure: 'Question block with four answer options and submit button',
      zones: ['Question area', 'Answer list', 'Feedback area', 'Submit control'],
    },
  };

  return {
    screenType: screenTypes[screenType].name,
    title,
    body,
    cta,
    ...specs[screenType],
  };
}

function PreviewCanvas({ form }) {
  const t = themes[form.theme];

  if (form.screenType === 'title') {
    return (
      <div className={`w-full aspect-video rounded-3xl border shadow-sm overflow-hidden ${t.surface}`}>
        <div className={`h-4 ${t.accent}`} />
        <div className="h-full p-10 flex flex-col items-center justify-center text-center gap-5">
          <Badge className={`${t.accentSoft} ${t.accentText} border-0`}>Section Intro</Badge>
          <h2 className="text-4xl font-bold max-w-3xl">{form.title}</h2>
          <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">{form.body}</p>
          <Button className={`${t.button} text-white rounded-2xl px-6`}>{form.cta}</Button>
        </div>
      </div>
    );
  }

  if (form.screenType === 'content') {
    return (
      <div className={`w-full aspect-video rounded-3xl border shadow-sm overflow-hidden ${t.surface}`}>
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-6 p-8 flex flex-col">
            <Badge className={`w-fit ${t.accentSoft} ${t.accentText} border-0 mb-4`}>Content</Badge>
            <h2 className="text-3xl font-bold mb-4">{form.title}</h2>
            <p className="text-slate-600 leading-7">{form.body}</p>
            <div className="mt-auto pt-6">
              <Button className={`${t.button} text-white rounded-2xl`}>{form.cta}</Button>
            </div>
          </div>
          <div className={`col-span-6 m-8 rounded-3xl border-2 border-dashed ${t.border} ${t.accentSoft} flex items-center justify-center`}>
            <div className="text-center">
              <Layers3 className={`mx-auto mb-3 ${t.accentText}`} />
              <p className={`font-medium ${t.accentText}`}>Image / Illustration Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (form.screenType === 'interaction') {
    return (
      <div className={`w-full aspect-video rounded-3xl border shadow-sm overflow-hidden ${t.surface} p-8`}>
        <h2 className="text-3xl font-bold mb-2">{form.title}</h2>
        <p className="text-slate-600 mb-6">{form.body}</p>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`rounded-3xl ${t.accentSoft} border ${t.border} h-28 flex items-center justify-center font-semibold ${t.accentText}`}>
              Hotspot {n}
            </div>
          ))}
        </div>
        <div className={`rounded-3xl border ${t.border} p-6 h-40 flex items-center justify-center text-slate-500`}>
          Reveal / Feedback Panel
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full aspect-video rounded-3xl border shadow-sm overflow-hidden ${t.surface} p-8`}>
      <Badge className={`${t.accentSoft} ${t.accentText} border-0 mb-4`}>Knowledge Check</Badge>
      <h2 className="text-3xl font-bold mb-3">{form.title}</h2>
      <p className="text-slate-600 mb-6">{form.body}</p>
      <div className="space-y-3 mb-6">
        {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((opt) => (
          <div key={opt} className="rounded-2xl border p-4 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border" />
            <span>{opt}</span>
          </div>
        ))}
      </div>
      <Button className={`${t.button} text-white rounded-2xl`}>{form.cta}</Button>
    </div>
  );
}

export default function StorylineLayoutGenerator() {
  const [form, setForm] = useState({
    screenType: 'content',
    title: screenTypes.content.defaults.title,
    body: screenTypes.content.defaults.body,
    cta: screenTypes.content.defaults.cta,
    theme: 'corporate',
    slideSize: '16:9 (1920 x 1080)',
  });

  const spec = useMemo(() => generateSpec(form), [form]);

  const applyScreenType = (value) => {
    const preset = screenTypes[value].defaults;
    setForm((prev) => ({
      ...prev,
      screenType: value,
      title: preset.title,
      body: preset.body,
      cta: preset.cta,
    }));
  };

  return (
    <div className={`min-h-screen ${themes[form.theme].page} p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 rounded-3xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <LayoutTemplate className="w-6 h-6" />
              Storyline Layout Generator
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Generate planning-friendly screen layouts for Storyline slides and export a clear visual specification.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Screen Type</Label>
              <Select value={form.screenType} onValueChange={applyScreenType}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(screenTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">{screenTypes[form.screenType].description}</p>
            </div>

            <div className="space-y-2">
              <Label>Slide Title</Label>
              <Input
                className="rounded-2xl"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Body Copy</Label>
              <Textarea
                className="rounded-2xl min-h-28"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                className="rounded-2xl"
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Palette className="w-4 h-4" /> Theme</Label>
                <Select value={form.theme} onValueChange={(value) => setForm({ ...form, theme: value })}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Type className="w-4 h-4" /> Slide Size</Label>
                <Select value={form.slideSize} onValueChange={(value) => setForm({ ...form, slideSize: value })}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9 (1920 x 1080)">16:9 (1920 x 1080)</SelectItem>
                    <SelectItem value="4:3 (1280 x 960)">4:3 (1280 x 960)</SelectItem>
                    <SelectItem value="Custom Story Size">Custom Story Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className={`rounded-2xl text-white ${themes[form.theme].button}`}>
                <Wand2 className="w-4 h-4 mr-2" /> Generate
              </Button>
              <Button variant="outline" className="rounded-2xl">
                <Download className="w-4 h-4 mr-2" /> Export Spec
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl">
              <TabsTrigger value="preview" className="rounded-2xl">Preview</TabsTrigger>
              <TabsTrigger value="spec" className="rounded-2xl">Layout Spec</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <Card className="rounded-3xl shadow-sm border-0">
                <CardContent className="p-5 md:p-6">
                  <PreviewCanvas form={form} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="spec" className="mt-4">
              <Card className="rounded-3xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold">Generated Layout Specification</h3>
                      <p className="text-slate-600 text-sm">Use this as a build guide for Storyline or as the basis for later PPT/SVG export.</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-3 py-1">{spec.screenType}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(spec).map(([key, value]) => (
                      <div key={key} className="rounded-2xl border p-4 bg-slate-50">
                        <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{key}</div>
                        {Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-2">
                            {value.map((item) => (
                              <Badge key={item} variant="secondary" className="rounded-full">{item}</Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-slate-800 leading-6">{value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
