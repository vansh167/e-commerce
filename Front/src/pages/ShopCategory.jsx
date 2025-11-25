import React, { useMemo, useState } from 'react';
import './css/ShopCategory.css';
import { useShopContext } from '../context/ShopContext';
import Item from '../components/items/Item';

const DEFAULT_PAGE_SIZE = 12;

const ShopCategory = (props) => {
  const { all_product = [] } = useShopContext();
  const [sortBy, setSortBy] = useState('default'); // default | price-asc | price-desc | newest | name-asc
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PAGE_SIZE);

  // Filter by category if provided
  const filtered = useMemo(() => {
    if (!all_product || all_product.length === 0) return [];
    if (!props.category) return all_product.slice();
    return all_product.filter((item) => item.category === props.category);
  }, [all_product, props.category]);

  // Sort the filtered list according to sortBy
  const sorted = useMemo(() => {
    const arr = filtered.slice(); // copy
    switch (sortBy) {
      case 'price-asc':
        return arr.sort((a, b) => Number(a.new_price || a.price || 0) - Number(b.new_price || b.price || 0));
      case 'price-desc':
        return arr.sort((a, b) => Number(b.new_price || b.price || 0) - Number(a.new_price || a.price || 0));
      case 'name-asc':
        return arr.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
      case 'newest':
        return arr.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id || 0);
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id || 0);
          return dateB - dateA;
        });
      case 'default':
      default:
        return arr;
    }
  }, [filtered, sortBy]);

  // Slice for pagination / "load more"
  const visibleProducts = useMemo(() => sorted.slice(0, visibleCount), [sorted, visibleCount]);

  const total = sorted.length;
  const showingFrom = total === 0 ? 0 : 1;
  const showingTo = Math.min(visibleCount, total);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + DEFAULT_PAGE_SIZE, sorted.length));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setVisibleCount(DEFAULT_PAGE_SIZE);
  };

  // Inline SVG data URI for a crisp chevron icon
  const svgChevron = "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'><path d='M6 9l6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/></svg>`
    );

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="Shop Banner" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {showingFrom}-{showingTo}</span> out of {total} products
        </p>

        <div className="shopcategory-sort">
          <label htmlFor="sortSelect" className="sr-only">Sort by</label>

          <div className="sort-select-wrap">
            <select
              id="sortSelect"
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="newest">Newest</option>
            </select>

            {/* SVG icon next to the select (crisp via data URI) */}
            <img src={svgChevron} alt="" className="sort-icon" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="shopcategory-products">
        {visibleProducts && visibleProducts.length > 0 ? (
          visibleProducts.map((item) => (
            <Item
              key={item.id ?? item.name}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {visibleToLessThanTotal(visibleCount, total) && (
        <div className="shopcategory-loadmore" onClick={handleLoadMore} role="button" tabIndex={0}>
          Explore More
        </div>
      )}
    </div>
  );
};

function visibleToLessThanTotal(visible, total) {
  return total > 0 && visible < total;
}

export default ShopCategory;
