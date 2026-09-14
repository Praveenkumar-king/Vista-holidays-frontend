import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { productUpdateService } from '../../services/productUpdateService';

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const ProductUpdateModal = ({ isOpen, onClose, updateToEdit, onSuccess }) => {
  const toast = useToast();
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [slides, setSlides] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [errors, setErrors] = useState({});

  // Hidden file input references for each slide
  const fileInputRefs = useRef([]);

  useEffect(() => {
    if (updateToEdit) {
      setVersion(updateToEdit.version || '');
      setTitle(updateToEdit.title || '');
      setDescription(updateToEdit.description || '');
      setStatus(updateToEdit.status || 'draft');
      setSlides(
        updateToEdit.slides && updateToEdit.slides.length > 0
          ? updateToEdit.slides.map(s => ({ ...s }))
          : []
      );
    } else {
      // Default empty form for new update
      setVersion('');
      setTitle('');
      setDescription('');
      setStatus('draft');
      setSlides([
        {
          title: '',
          description: '',
          imageUrl: '',
          cloudinaryPublicId: '',
          order: 0
        }
      ]);
    }
    setErrors({});
  }, [updateToEdit, isOpen]);

  if (!isOpen) return null;

  const isSemVerValid = SEMVER_REGEX.test(version.trim());

  // Slide management
  const handleAddSlide = () => {
    setSlides(prev => [
      ...prev,
      {
        title: '',
        description: '',
        imageUrl: '',
        cloudinaryPublicId: '',
        order: prev.length
      }
    ]);
  };

  const handleRemoveSlide = async (index) => {
    const slideToRemove = slides[index];
    // If it has an uploaded image and it's a new update draft, optionally delete from Cloudinary
    if (slideToRemove.cloudinaryPublicId && !updateToEdit) {
      try {
        await productUpdateService.deleteSlideImage(slideToRemove.cloudinaryPublicId);
      } catch (err) {
        console.warn('Could not remove slide image from Cloudinary:', err);
      }
    }

    setSlides(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx })));
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    setSlides(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((s, idx) => ({ ...s, order: idx }));
    });
  };

  const handleSlideChange = (index, field, value) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Cloudinary image file upload
  const handleImageFileSelect = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file could be selected again if needed
    event.target.value = '';

    // Validate client-side size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size exceeds the 10MB limit. Please choose a smaller image.', 'Upload Error');
      return;
    }

    setUploadingIndex(index);
    try {
      const response = await productUpdateService.uploadSlideImage(file);
      if (response.success && response.data) {
        const { secureUrl, publicId } = response.data;
        handleSlideChange(index, 'imageUrl', secureUrl);
        handleSlideChange(index, 'cloudinaryPublicId', publicId);
        toast.success(`Image uploaded to Cloudinary for Slide #${index + 1}!`, 'Uploaded');
      } else {
        throw new Error(response.message || 'Image upload failed');
      }
    } catch (err) {
      toast.error(
        err.message || 'Failed to upload image to Cloudinary. Check server credentials.',
        'Upload Failed'
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveSlideImage = async (index) => {
    const slide = slides[index];
    if (slide.cloudinaryPublicId) {
      try {
        await productUpdateService.deleteSlideImage(slide.cloudinaryPublicId);
      } catch (err) {
        console.warn('Image delete failed:', err);
      }
    }
    handleSlideChange(index, 'imageUrl', '');
    handleSlideChange(index, 'cloudinaryPublicId', '');
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!version.trim()) {
      newErrors.version = 'Version is required (e.g. 1.0.0)';
    } else if (!isSemVerValid) {
      newErrors.version = 'Must be a valid Semantic Version (e.g., 1.0.0, 1.2.0-beta.1)';
    }

    if (!title.trim()) {
      newErrors.title = 'Main update title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Main update description is required';
    }

    if (status === 'published' && slides.length === 0) {
      newErrors.slides = 'At least 1 slide is required to publish this update';
    }

    // Check each slide has title and image
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (!s.title.trim()) {
        newErrors[`slide_${i}_title`] = `Slide #${i + 1} requires a title`;
      }
      if (!s.imageUrl.trim()) {
        newErrors[`slide_${i}_image`] = `Slide #${i + 1} requires an uploaded Cloudinary image`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve the highlighted validation errors before saving.', 'Validation Error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        version: version.trim(),
        title: title.trim(),
        description: description.trim(),
        status,
        slides: slides.map((s, idx) => ({
          title: s.title.trim(),
          description: s.description.trim(),
          imageUrl: s.imageUrl.trim(),
          cloudinaryPublicId: s.cloudinaryPublicId?.trim() || '',
          order: idx
        }))
      };

      if (updateToEdit) {
        await productUpdateService.updateUpdate(updateToEdit._id, payload);
        toast.success(`Product update v${payload.version} updated successfully!`, 'Update Saved');
      } else {
        await productUpdateService.createUpdate(payload);
        toast.success(`Product update v${payload.version} created successfully!`, 'Update Created');
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save product update.', 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight">
                {updateToEdit ? `Edit Product Update v${updateToEdit.version}` : 'Create New Product Update'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure release details and carousel announcement slides shown to travelers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form id="product-update-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top 2-Column: Version & Publish Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Version (SemVer) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 1.2.0 or 2.0.0-beta.1"
                  value={version}
                  onChange={(e) => {
                    setVersion(e.target.value);
                    if (errors.version) setErrors(prev => ({ ...prev, version: null }));
                  }}
                  className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 font-mono focus:outline-none transition-colors ${
                    errors.version 
                      ? 'border-rose-500 focus:border-rose-400' 
                      : version && isSemVerValid 
                      ? 'border-emerald-500/80 focus:border-emerald-500' 
                      : 'border-slate-800 focus:border-brand-500'
                  }`}
                />
                {version && isSemVerValid && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {errors.version ? (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.version}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Standard Semantic Version format required (e.g., 1.0.0, 1.2.3).
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Publish Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              >
                <option value="draft">Draft (Save privately for preview)</option>
                <option value="published">Published (Present to users)</option>
                <option value="unpublished">Unpublished (Archived / Inactive)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {status === 'published' 
                  ? 'Active: Unseen users will receive this update on their next dashboard visit.' 
                  : status === 'draft'
                  ? 'Draft: Only visible to admins in management directory.'
                  : 'Unpublished: Hidden from user presentation.'}
              </p>
            </div>
          </div>

          {/* Main Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Main Update Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Introducing Vista AI Travel Companion & Dark Mode"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
              }}
              className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors.title ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Main Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Main Update Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Provide a comprehensive summary of what is new, enhanced, and resolved in this release..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                errors.description ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Carousel Slides Section */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Carousel Slides
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual slides shown sequentially in the user popup carousel. Images are hosted on Cloudinary.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                iconLeft={Plus}
                onClick={handleAddSlide}
                className="text-xs border-brand-500/40 text-brand-300 hover:bg-brand-500/10"
              >
                Add Slide
              </Button>
            </div>

            {errors.slides && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.slides}</span>
              </div>
            )}

            {slides.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                <Layers className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm text-slate-400">No slides configured yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Add Slide" above to add feature highlights with Cloudinary-hosted images.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md relative group transition-all duration-200"
                  >
                    {/* Slide Top Bar */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center text-xs font-bold font-mono">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Slide #{index + 1}
                        </span>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Slide Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Slide Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] h-4 bg-slate-800 mx-1" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Left 7 Columns: Slide Title & Description */}
                      <div className="lg:col-span-7 space-y-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Slide Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Real-Time Weather Radar & Forecasts"
                            value={slide.title}
                            onChange={(e) => {
                              handleSlideChange(index, 'title', e.target.value);
                              if (errors[`slide_${index}_title`]) {
                                setErrors(prev => ({ ...prev, [`slide_${index}_title`]: null }));
                              }
                            }}
                            className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                              errors[`slide_${index}_title`] ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
                            }`}
                          />
                          {errors[`slide_${index}_title`] && (
                            <p className="text-[10px] text-rose-400 mt-1">
                              {errors[`slide_${index}_title`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Slide Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Describe what this feature offers travelers and how it enhances trip planning..."
                            value={slide.description}
                            onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Right 5 Columns: Cloudinary Image Dropzone / Preview */}
                      <div className="lg:col-span-5">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Slide Image (Cloudinary) <span className="text-rose-400">*</span>
                        </label>

                        {/* Hidden native input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          onChange={(e) => handleImageFileSelect(index, e)}
                          className="hidden"
                        />

                        {slide.imageUrl ? (
                          // Uploaded Cloudinary Image Preview Card
                          <div className="relative group/img rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 aspect-video flex items-center justify-center">
                            <img
                              src={slide.imageUrl}
                              alt={slide.title || `Slide ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Cloudinary Badge */}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-sky-400 flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3 text-sky-400" />
                              <span>Cloudinary Hosted</span>
                            </div>

                            {/* Hover Overlay Controls */}
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                disabled={uploadingIndex === index}
                                className="text-xs bg-white/90 hover:bg-white text-slate-900 font-semibold"
                              >
                                Replace
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="xs"
                                onClick={() => handleRemoveSlideImage(index)}
                                className="text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Dropzone trigger
                          <div
                            onClick={() => {
                              if (uploadingIndex !== index) {
                                fileInputRefs.current[index]?.click();
                              }
                            }}
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center aspect-video ${
                              errors[`slide_${index}_image`]
                                ? 'border-rose-500/60 bg-rose-500/5'
                                : 'border-slate-800 hover:border-brand-500/60 hover:bg-slate-900/60 bg-slate-900/30'
                            }`}
                          >
                            {uploadingIndex === index ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
                                <span className="text-xs text-brand-300 font-semibold">
                                  Uploading to Cloudinary...
                                </span>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="w-7 h-7 text-slate-500 mb-1.5 group-hover:text-brand-400 transition-colors" />
                                <span className="text-xs font-semibold text-slate-300">
                                  Upload Slide Image
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5">
                                  PNG, JPG, WEBP (Max 10MB)
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {errors[`slide_${index}_image`] && (
                          <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors[`slide_${index}_image`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky bottom-0 z-10">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="product-update-form"
            variant="primary"
            size="sm"
            loading={saving}
            className="shadow-md shadow-brand-500/25 px-5 font-semibold"
          >
            {updateToEdit ? 'Save Changes' : 'Create Product Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdateModal;
