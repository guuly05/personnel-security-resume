import { ImageResponse } from '@vercel/og';
import { BLOG_POSTS } from '../src/blog/posts.js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
      return new Response('Blog post not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0d1117',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(34, 211, 238, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 40%)',
            padding: '80px',
            fontFamily: 'sans-serif',
            position: 'relative',
            border: '8px solid #1f2937',
          }}
        >
          {/* Subtle Ambient Top Border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #22d3ee, #9333ea)',
            }}
          />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #22d3ee, #9333ea)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontSize: '22px',
                  boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)',
                }}
              >
                GM
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                  Guuleed Maxamuud
                </span>
                <span style={{ fontSize: '12px', color: '#22d3ee', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                  Vulnerability Assessment &amp; Penetration Tester
                </span>
              </div>
            </div>
            {post.mood && (
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  color: '#22d3ee',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {post.mood}
              </div>
            )}
          </div>

          {/* Body / Title */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '40px', flexGrow: 1, justifyContent: 'center' }}>
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 'extrabold',
                color: '#ffffff',
                lineHeight: 1.2,
                margin: 0,
                padding: 0,
                letterSpacing: '-1px',
              }}
            >
              {post.title}
            </h1>
            <p
              style={{
                fontSize: '22px',
                color: '#94a3b8',
                lineHeight: 1.4,
                marginTop: '20px',
                marginBottom: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.subtitle}
            </p>
          </div>

          {/* Footer Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #1f2937',
              paddingTop: '32px',
              marginTop: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '16px' }}>{post.date}</span>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#475569' }} />
              <span style={{ color: '#64748b', fontSize: '16px' }}>{post.readTime}</span>
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#22d3ee',
                letterSpacing: '0.5px',
              }}
            >
              guuleedmaxamuud.dev
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Unable to generate the image right now.', {
      status: 500,
    });
  }
}
