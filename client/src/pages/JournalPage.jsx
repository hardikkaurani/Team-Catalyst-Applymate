import React, { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Edit, Filter } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/ui/Toast';
import { journalApi } from '../api/journalApi';
import { companyApi } from '../api/companyApi';
import { INTERVIEW_ROUND_TYPES, DIFFICULTY_LEVELS } from '../constants/statusConstants';
import { formatDate, formatInputDate } from '../utils/dateUtils';

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    roundType: 'Technical',
    interviewDate: formatInputDate(new Date()),
    questionsAsked: '',
    topics: '',
    difficulty: 'Medium',
    performanceRating: 3,
    reflection: '',
  });

  const [deleteId, setDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchJournalsAndCompanies();
  }, [difficultyFilter]);

  const fetchJournalsAndCompanies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (difficultyFilter) params.difficulty = difficultyFilter;

      const [jRes, cRes] = await Promise.allSettled([
        journalApi.getAll(params),
        companyApi.getAll(),
      ]);

      if (jRes.status === 'fulfilled') {
        const jRaw = jRes.value.data;
        const jList = jRaw?.data?.entries || jRaw?.entries || jRaw?.data || jRaw || [];
        setJournals(Array.isArray(jList) ? jList : []);
      }

      if (cRes.status === 'fulfilled') {
        const cRaw = cRes.value.data;
        const cList = cRaw?.data?.companies || cRaw?.companies || cRaw?.data || cRaw || [];
        setCompanies(Array.isArray(cList) ? cList : []);
      }
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setFormData({
      companyId: companies[0]?._id || '',
      roundType: 'Technical',
      interviewDate: formatInputDate(new Date()),
      questionsAsked: '',
      topics: '',
      difficulty: 'Medium',
      performanceRating: 3,
      reflection: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      companyId: entry.companyId?._id || entry.companyId || '',
      roundType: entry.roundType || 'Technical',
      interviewDate: formatInputDate(entry.interviewDate),
      questionsAsked: entry.questionsAsked || '',
      topics: Array.isArray(entry.topics) ? entry.topics.join(', ') : entry.topics || '',
      difficulty: entry.difficulty || 'Medium',
      performanceRating: entry.performanceRating || 3,
      reflection: entry.reflection || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      topics: typeof formData.topics === 'string'
        ? formData.topics.split(',').map((t) => t.trim()).filter(Boolean)
        : formData.topics,
    };

    try {
      if (editingEntry) {
        await journalApi.update(editingEntry._id, payload);
        setToastMessage({ type: 'success', text: 'Journal entry updated!' });
      } else {
        await journalApi.create(payload);
        setToastMessage({ type: 'success', text: 'Journal entry logged!' });
      }
      setIsModalOpen(false);
      fetchJournalsAndCompanies();
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to save journal entry.' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await journalApi.delete(deleteId);
      setToastMessage({ type: 'success', text: 'Journal entry deleted.' });
      setDeleteId(null);
      fetchJournalsAndCompanies();
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Failed to delete entry.' });
    }
  };

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 text-amber-700',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/40 text-red-700',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Interview Reflections Journal
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Log interview questions, topics covered, difficulty ratings, and post-round takeaways.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
            Log Interview
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark p-4 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
            <span className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
              Difficulty Filter:
            </span>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              options={[{ value: '', label: 'All Difficulties' }, ...DIFFICULTY_LEVELS]}
              className="w-48"
            />
          </div>
        </div>

        {/* Journal Entries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader count={4} className="h-56" />
          </div>
        ) : journals.length === 0 ? (
          <EmptyState
            title="No Interview Reflections Logged"
            description="Keep a record of questions asked during Technical & HR rounds."
            actionText="Log Interview"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((entry) => (
              <Card key={entry._id} hover className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        {entry.companyId?.name || entry.companyName || 'Company'}
                      </h3>
                      <p className="text-xs font-semibold text-accent-primary">
                        {entry.roundType} Round • {formatDate(entry.interviewDate)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        difficultyColors[entry.difficulty] || difficultyColors.Medium
                      }`}
                    >
                      {entry.difficulty}
                    </span>
                  </div>

                  {entry.questionsAsked && (
                    <div>
                      <p className="text-xs font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark">
                        Questions Asked:
                      </p>
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mt-0.5 line-clamp-3">
                        {entry.questionsAsked}
                      </p>
                    </div>
                  )}

                  {entry.topics && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(Array.isArray(entry.topics) ? entry.topics : [entry.topics]).map(
                        (top, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent-primary/10 text-accent-primary"
                          >
                            #{top}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-text-secondary-light dark:text-text-secondary-dark mr-1">
                      Rating:
                    </span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (entry.performanceRating || 3)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleOpenEditModal(entry)} />
                    <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteId(entry._id)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Log Interview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntry ? 'Edit Interview Journal' : 'Log Interview Reflection'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Select
            label="Company"
            name="companyId"
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            options={companies.map((c) => ({ value: c._id, label: `${c.name} (${c.role})` }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Round Type"
              name="roundType"
              value={formData.roundType}
              onChange={(e) => setFormData({ ...formData, roundType: e.target.value })}
              options={INTERVIEW_ROUND_TYPES}
              required
            />

            <Input
              label="Interview Date"
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={DIFFICULTY_LEVELS}
              required
            />

            <Select
              label="Performance Rating (1-5)"
              name="performanceRating"
              value={formData.performanceRating}
              onChange={(e) =>
                setFormData({ ...formData, performanceRating: Number(e.target.value) })
              }
              options={[
                { value: 1, label: '1 Star - Poor' },
                { value: 2, label: '2 Stars - Below Average' },
                { value: 3, label: '3 Stars - Average' },
                { value: 4, label: '4 Stars - Good' },
                { value: 5, label: '5 Stars - Excellent' },
              ]}
              required
            />
          </div>

          <Input
            label="Topics Covered (comma-separated)"
            name="topics"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            placeholder="e.g. Binary Trees, System Design, SQL"
          />

          <Input
            label="Questions Asked"
            name="questionsAsked"
            value={formData.questionsAsked}
            onChange={(e) => setFormData({ ...formData, questionsAsked: e.target.value })}
            placeholder="Key technical coding questions or behavioral scenarios asked..."
            multiline
            rows={3}
          />

          <Input
            label="Reflection & Post-Round Takeaways"
            name="reflection"
            value={formData.reflection}
            onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
            placeholder="What went well, what needs improvement for next time..."
            multiline
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingEntry ? 'Save Changes' : 'Log Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this reflection entry?"
      />

      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
