import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatApiError } from '../../../api/client.js';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { ErrorState } from '../../../components/shared/ErrorState.jsx';
import { LoadingState } from '../../../components/shared/LoadingState.jsx';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { Seo } from '../../../components/shared/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Field, Input } from '../../../components/ui/Field.jsx';
import { Pagination } from '../../../components/ui/Pagination.jsx';
import { useInterests } from '../hooks.js';

export function InterestsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('');

  const interestsQuery = useInterests({
    page,
    limit,
    interest: filter || undefined,
  });

  const groups = useMemo(
    () => interestsQuery.data?.groups || [],
    [interestsQuery.data?.groups],
  );
  const meta = interestsQuery.data?.meta;

  const chartData = useMemo(
    () =>
      [...groups]
        .sort((first, second) => second.userCount - first.userCount)
        .slice(0, 10)
        .map((group) => ({
          name: group.interest,
          users: group.userCount,
        })),
    [groups],
  );

  function applyFilter(event) {
    event.preventDefault();
    setFilter(input.trim());
    setPage(1);
  }

  function clearFilter() {
    setInput('');
    setFilter('');
    setPage(1);
  }

  return (
    <>
      <Seo title={t('Users by interest')} path="/admin/interests" noIndex />
      <PageHeader
        title={t('Users by interest')}
        description={t('A single aggregation pipeline groups users by each interest.')}
      />

      <form className="ui-filter-bar" onSubmit={applyFilter}>
        <Field label={t('Interest')} htmlFor="interest-filter">
          <Input
            id="interest-filter"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('e.g. chess')}
          />
        </Field>
        <div className="ui-row">
          <Button type="submit">{t('Filter')}</Button>
          <Button type="button" variant="ghost" onClick={clearFilter}>
            {t('Clear')}
          </Button>
        </div>
      </form>

      {interestsQuery.isLoading ? <LoadingState /> : null}

      {!interestsQuery.isLoading && interestsQuery.isError ? (
        <ErrorState
          message={formatApiError(interestsQuery.error, t)}
          onRetry={interestsQuery.refetch}
        />
      ) : null}

      {!interestsQuery.isLoading && !interestsQuery.isError && groups.length === 0 ? (
        <EmptyState title={t('No interest groups found.')} />
      ) : null}

      {groups.length > 0 ? (
        <>
          <section className="ui-chart-card" aria-labelledby="interest-chart-title">
            <div className="ui-chart-card__header">
              <h2 id="interest-chart-title">{t('Interest distribution')}</h2>
              <span className="ui-muted ui-small">{t('Users per interest')}</span>
            </div>
            <div className="ui-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      color: 'var(--color-text)',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="users"
                    name={t('Users per interest')}
                    fill="var(--color-accent)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="ui-group-grid">
            {groups.map((group) => (
              <article className="ui-group-card" key={group.interest}>
                <div className="ui-group-card__header">
                  <h2>{group.interest}</h2>
                  <span className="ui-badge">
                    {t('{{count}} users', { count: group.userCount })}
                  </span>
                </div>
                <ul>
                  {group.users.map((user) => (
                    <li key={user._id}>
                      <Link to={`/users/${user._id}/posts`}>{user.name}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      ) : null}

      <Pagination meta={meta} onPageChange={setPage} />
    </>
  );
}
