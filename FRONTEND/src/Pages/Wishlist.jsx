import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Wishlist = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWishlist = async () => {
    const token = localStorage.getItem('userToken')
    const base = localStorage.getItem('apiBase') || 'http://localhost:5000'
    if (!token) {
      setItems([])
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`${base}/api/profile/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (res.ok) setItems(Array.isArray(data) ? data : [])
    } catch (_) {
      const raw = localStorage.getItem('wishlist')
      setItems(raw ? JSON.parse(raw) : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadWishlist() }, [])

  const removeItem = async (idOrSlug) => {
    const token = localStorage.getItem('userToken')
    const base = localStorage.getItem('apiBase') || 'http://localhost:5000'
    // If looks like Mongo id, call backend; else update local list
    if (token && typeof idOrSlug === 'string' && /^[a-fA-F0-9]{24}$/.test(idOrSlug)) {
      await fetch(`${base}/api/profile/wishlist/${idOrSlug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      loadWishlist()
    } else {
      const next = items.filter((p) => (p._id || p.slug) !== idOrSlug)
      setItems(next)
      localStorage.setItem('wishlist', JSON.stringify(next))
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>

  return (
    <div style={{ padding: 16 }}>
      <h1>My Wishlist</h1>
      {items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map((p) => (
            <div key={p._id || p.slug} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <Link to={p.slug ? `/category/${p.category || 'category'}/${p.subcategory || 'subcategory'}/${p.slug}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 6, background: '#fafafa' }}>
                  <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
                <div style={{ marginTop: 8, fontWeight: 600 }}>{p.name}</div>
                {p.price != null && (
                  <div style={{ marginTop: 4 }}>₹{p.price}</div>
                )}
              </Link>
              <button onClick={() => removeItem(p._id || p.slug)} style={{ marginTop: 8 }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist