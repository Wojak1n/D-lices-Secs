import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Gift, Package, Upload, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Pack, Product, PackItem } from '../../types';
import { formatPrice } from '../../utils/currency';

const AdminPacks: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    items: [] as PackItem[],
    packPrice: 0,
    stock: 0,
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedPacks = JSON.parse(localStorage.getItem('packs') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setPacks(storedPacks);
    setProducts(storedProducts);
  };

  const calculateOriginalPrice = (items: PackItem[]) => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateDiscount = (originalPrice: number, packPrice: number) => {
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - packPrice) / originalPrice) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const originalPrice = calculateOriginalPrice(formData.items);
    const discount = calculateDiscount(originalPrice, formData.packPrice);
    
    const packData: Pack = {
      id: editingPack?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: formData.items,
      originalPrice,
      packPrice: formData.packPrice,
      discount,
      stock: formData.stock,
      featured: formData.featured,
      createdAt: editingPack?.createdAt || new Date().toISOString()
    };

    let updatedPacks;
    if (editingPack) {
      updatedPacks = packs.map(pack => pack.id === editingPack.id ? packData : pack);
    } else {
      updatedPacks = [...packs, packData];
    }

    localStorage.setItem('packs', JSON.stringify(updatedPacks));
    setPacks(updatedPacks);
    resetForm();
  };

  const handleEdit = (pack: Pack) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description,
      image: pack.image,
      items: pack.items,
      packPrice: pack.packPrice,
      stock: pack.stock,
      featured: pack.featured
    });
    setImagePreview(pack.image);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = (packId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) {
      const updatedPacks = packs.filter(pack => pack.id !== packId);
      localStorage.setItem('packs', JSON.stringify(updatedPacks));
      setPacks(updatedPacks);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      items: [],
      packPrice: 0,
      stock: 0,
      featured: false
    });
    setEditingPack(null);
    setShowModal(false);
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({...formData, image: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData({...formData, image: ''});
  };

  const addPackItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    });
  };

  const updatePackItem = (index: number, field: keyof PackItem, value: string | number) => {
    const updatedItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const removePackItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const filteredPacks = packs.filter(pack =>
    pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pack.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produit introuvable';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Gestion des Packs Cadeaux</h1>
            <p className="text-stone-600">Créez et gérez vos coffrets cadeaux</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Pack</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher un pack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Packs List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">
              Packs Cadeaux ({filteredPacks.length})
            </h2>
          </div>
          
          {filteredPacks.length === 0 ? (
            <div className="p-12 text-center">
              <Gift className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-800 mb-2">Aucun pack trouvé</h3>
              <p className="text-stone-600">
                {searchTerm ? 'Aucun pack ne correspond à votre recherche.' : 'Commencez par créer votre premier pack cadeau.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filteredPacks.map((pack) => (
                <div key={pack.id} className="p-6 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={pack.image}
                        alt={pack.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-stone-800">{pack.name}</h3>
                        <p className="text-stone-600 text-sm line-clamp-1">{pack.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-stone-500">
                            {pack.items.length} produit{pack.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-sm text-stone-500">Stock: {pack.stock}</span>
                          {pack.featured && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                              Populaire
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-stone-400 line-through">
                          {formatPrice(pack.originalPrice)}
                        </p>
                        <p className="font-medium text-stone-800">
                          {formatPrice(pack.packPrice)}
                        </p>
                        <p className="text-sm text-emerald-600">-{pack.discount}%</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(pack)}
                          className="p-2 text-stone-600 hover:text-emerald-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pack.id)}
                          className="p-2 text-stone-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-semibold text-stone-800">
                {editingPack ? 'Modifier le Pack' : 'Nouveau Pack Cadeau'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-2">
                    Nom du pack
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-stone-700 font-medium mb-2">
                    Image du pack
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded-lg border border-stone-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pack-image-upload"
                    />
                    <label
                      htmlFor="pack-image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="h-8 w-8 text-stone-400" />
                      <span className="text-stone-600">
                        {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner une image'}
                      </span>
                      <span className="text-stone-400 text-sm">
                        PNG, JPG, JPEG jusqu'à 5MB
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Pack Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-stone-700 font-medium">
                    Produits du pack
                  </label>
                  <button
                    type="button"
                    onClick={addPackItem}
                    className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors"
                  >
                    Ajouter un produit
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-stone-200 rounded-lg">
                      <select
                        value={item.productId}
                        onChange={(e) => updatePackItem(index, 'productId', e.target.value)}
                        className="flex-1 px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionner un produit</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatPrice(product.price)}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updatePackItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Qté"
                        required
                      />
                      
                      <button
                        type="button"
                        onClick={() => removePackItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-2">
                    Prix du pack (DH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.packPrice}
                    onChange={(e) => setFormData({ ...formData, packPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-stone-700 font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-stone-700">Pack populaire</span>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              {formData.items.length > 0 && (
                <div className="bg-stone-50 p-4 rounded-lg">
                  <h4 className="font-medium text-stone-800 mb-2">Résumé des prix</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Prix original total:</span>
                      <span>{formatPrice(calculateOriginalPrice(formData.items))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix du pack:</span>
                      <span className="font-semibold">{formatPrice(formData.packPrice)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Économies:</span>
                      <span>
                        {formatPrice(calculateOriginalPrice(formData.items) - formData.packPrice)} 
                        ({calculateDiscount(calculateOriginalPrice(formData.items), formData.packPrice)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingPack ? 'Mettre à jour' : 'Créer le pack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPacks;
