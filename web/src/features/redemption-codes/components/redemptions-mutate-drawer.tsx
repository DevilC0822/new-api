/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { zodResolver } from '@hookform/resolvers/zod'
import { type FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DateTimePicker } from '@/components/datetime-picker'
import {
  SideDrawerSection,
  sideDrawerContentClassName,
  sideDrawerFooterClassName,
  sideDrawerFormClassName,
  sideDrawerHeaderClassName,
} from '@/components/drawer-layout'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  formatQuotaWithCurrency,
  getCurrencyDisplay,
  getCurrencyLabel,
} from '@/lib/currency'
import {
  formatQuota,
  getEditableQuotaStep,
  parseQuotaFromDollars,
} from '@/lib/format'
import { handleServerError } from '@/lib/handle-server-error'
import { addTimeToDate } from '@/lib/time'
import { getAdminPlans } from '@/features/subscriptions/api'
import type { PlanRecord } from '@/features/subscriptions/types'

import { createRedemption, updateRedemption, getRedemption } from '../api'
import { SUCCESS_MESSAGES } from '../constants'
import {
  getRedemptionFormSchema,
  type RedemptionFormValues,
  REDEMPTION_FORM_DEFAULT_VALUES,
  transformFormDataToPayload,
  transformRedemptionToFormDefaults,
} from '../lib'
import type { Redemption } from '../types'
import {
  RedemptionsExportDialog,
  type RedemptionExportData,
} from './redemptions-export-dialog'
import { useRedemptions } from './redemptions-provider'

type RedemptionsMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Redemption
}

export function RedemptionsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: RedemptionsMutateDrawerProps) {
  const { t } = useTranslation()
  const isUpdate = !!currentRow
  const redemptionId = currentRow?.id
  const { triggerRefresh } = useRedemptions()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdCodes, setCreatedCodes] = useState<RedemptionExportData | null>(
    null
  )
  const [redemptionLoadState, setRedemptionLoadState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [loadedRedemption, setLoadedRedemption] = useState<Redemption | null>(
    null
  )

  const form = useForm<RedemptionFormValues>({
    resolver: zodResolver(getRedemptionFormSchema(t)),
    defaultValues: REDEMPTION_FORM_DEFAULT_VALUES,
  })

  const [plans, setPlans] = useState<PlanRecord[]>([])

  useEffect(() => {
    if (!open) return
    let ignoreResult = false
    getAdminPlans()
      .then((res) => {
        if (ignoreResult) return
        if (res.success) setPlans(res.data || [])
      })
      .catch(() => {
        // 套餐加载失败时保持空列表，表单校验会阻止提交无效套餐
      })
    return () => {
      ignoreResult = true
    }
  }, [open])

  const codeType = form.watch('code_type')

  // Load existing data when updating
  useEffect(() => {
    if (!open) {
      form.reset(REDEMPTION_FORM_DEFAULT_VALUES)
      setRedemptionLoadState('idle')
      setLoadedRedemption(null)
      return
    }

    if (!isUpdate || redemptionId === undefined) {
      form.reset(REDEMPTION_FORM_DEFAULT_VALUES)
      setRedemptionLoadState('ready')
      setLoadedRedemption(null)
      return
    }

    let ignoreResult = false

    form.reset(REDEMPTION_FORM_DEFAULT_VALUES)
    setRedemptionLoadState('loading')
    setLoadedRedemption(null)

    void getRedemption(redemptionId)
      .then((result) => {
        if (ignoreResult) return

        if (
          !result.success ||
          !result.data ||
          result.data.id !== redemptionId
        ) {
          setRedemptionLoadState('error')
          handleServerError(result, t('Failed to load'))
          return
        }

        form.reset(transformRedemptionToFormDefaults(result.data))
        setLoadedRedemption(result.data)
        setRedemptionLoadState('ready')
      })
      .catch((error: unknown) => {
        if (ignoreResult) return

        setRedemptionLoadState('error')
        handleServerError(error)
      })

    return () => {
      ignoreResult = true
    }
  }, [open, isUpdate, redemptionId, form, t])

  const isUpdateReady =
    !isUpdate ||
    (redemptionLoadState === 'ready' && loadedRedemption?.id === redemptionId)
  const isLoadingRedemption = redemptionLoadState === 'loading'

  const onSubmit = async (data: RedemptionFormValues) => {
    if (isUpdate && (!currentRow || !loadedRedemption || !isUpdateReady)) {
      return
    }

    setIsSubmitting(true)
    try {
      const basePayload = transformFormDataToPayload(data)

      if (isUpdate && currentRow && loadedRedemption) {
        const quota = form.getFieldState('quota_dollars').isDirty
          ? basePayload.quota
          : loadedRedemption.quota
        const result = await updateRedemption({
          ...basePayload,
          quota,
          id: currentRow.id,
        })
        if (result.success) {
          toast.success(t(SUCCESS_MESSAGES.REDEMPTION_UPDATED))
          onOpenChange(false)
          triggerRefresh()
        } else {
          handleServerError(result)
        }
      } else {
        // Create mode
        const result = await createRedemption(basePayload)
        if (result.success) {
          const count = result.data?.length || 0
          toast.success(
            count > 1
              ? t('Successfully created {{count}} redemption codes', {
                  count,
                })
              : t(SUCCESS_MESSAGES.REDEMPTION_CREATED)
          )
          if (result.data?.length) {
            const planTitle =
              data.code_type === 'subscription'
                ? plans.find((p) => Number(p.plan.id) === data.plan_id)?.plan
                    .title || ''
                : ''
            setCreatedCodes({
              keys: result.data,
              name: basePayload.name,
              quota:
                data.code_type === 'subscription'
                  ? `${t('Subscription')}: ${planTitle}`
                  : formatQuotaWithCurrency(basePayload.quota, {
                      abbreviate: false,
                    }),
            })
          }
          onOpenChange(false)
          triggerRefresh()
        } else {
          handleServerError(result)
        }
      }
    } catch (error) {
      handleServerError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!isUpdate) {
      const name = form.getValues('name')
      if (!name?.trim()) {
        if (form.getValues('code_type') === 'subscription') {
          const planId = form.getValues('plan_id')
          const plan = plans.find((p) => Number(p.plan.id) === planId)
          const title = (plan?.plan.title || '').slice(0, 20)
          if (title) form.setValue('name', title, { shouldValidate: true })
        } else {
          const quota = parseQuotaFromDollars(form.getValues('quota_dollars'))
          form.setValue('name', formatQuota(quota), { shouldValidate: true })
        }
      }
    }

    void form.handleSubmit(onSubmit)(event)
  }

  const handleSetExpiry = (months: number, days: number, hours: number) => {
    const newDate = addTimeToDate(months, days, hours)
    form.setValue('expired_time', newDate ?? null)
  }

  const { meta: currencyMeta } = getCurrencyDisplay()
  const currencyLabel = getCurrencyLabel()
  const tokensOnly = currencyMeta.kind === 'tokens'
  const quotaStep = getEditableQuotaStep()
  const quotaLabel = t('Quota ({{currency}})', { currency: currencyLabel })
  const quotaPlaceholder = tokensOnly
    ? t('Enter quota in tokens')
    : t('Enter quota in {{currency}}', { currency: currencyLabel })
  let submitButtonLabel = t('Save changes')
  if (isLoadingRedemption) {
    submitButtonLabel = t('Loading...')
  } else if (isSubmitting) {
    submitButtonLabel = t('Saving...')
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className={sideDrawerContentClassName('sm:max-w-[600px]')}
        >
          <SheetHeader className={sideDrawerHeaderClassName()}>
            <SheetTitle>
              {isUpdate
                ? t('Update Redemption Code')
                : t('Create Redemption Code')}
            </SheetTitle>
            <SheetDescription>
              {isUpdate
                ? t('Update the redemption code by providing necessary info.')
                : t(
                    'Add new redemption code(s) by providing necessary info.'
                  )}{' '}
              {t('Click save when you&apos;re done.')}
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              id='redemption-form'
              onSubmit={handleSubmit}
              className={sideDrawerFormClassName()}
              aria-busy={isLoadingRedemption}
            >
              <fieldset
                disabled={!isUpdateReady || isSubmitting}
                className='contents'
              >
                <SideDrawerSection>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Name')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('Enter a name')} />
                        </FormControl>
                        <FormDescription>
                          {t('Name for this redemption code (1-20 characters)')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='code_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Redemption type')}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value === 'subscription') {
                                form.setValue('quota_dollars', 0)
                              } else {
                                form.setValue('quota_dollars', 10)
                              }
                            }}
                            disabled={isUpdate}
                            className='flex gap-6'
                          >
                            {(
                              [
                                ['quota', t('Wallet quota')],
                                ['subscription', t('Subscription plan')],
                              ] as const
                            ).map(([value, label]) => (
                              <div
                                key={value}
                                className='flex items-center gap-2'
                              >
                                <RadioGroupItem
                                  id={`redemption-type-${value}`}
                                  value={value}
                                />
                                <Label
                                  htmlFor={`redemption-type-${value}`}
                                  className='cursor-pointer font-normal'
                                >
                                  {label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        {isUpdate && (
                          <FormDescription>
                            {t('Type cannot be changed after creation')}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {codeType === 'subscription' && (
                    <FormField
                      control={form.control}
                      name='plan_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Plan')}</FormLabel>
                          <FormControl>
                            <Combobox
                              value={
                                field.value > 0 ? String(field.value) : ''
                              }
                              onValueChange={(v) =>
                                field.onChange(v ? Number(v) : 0)
                              }
                              disabled={isUpdate}
                              placeholder={t('Select subscription plan')}
                              options={plans.map((p) => ({
                                value: String(p.plan.id),
                                label: `${p.plan.title} ($${Number(p.plan.price_amount || 0).toFixed(2)})`,
                              }))}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'Redeeming this code activates the selected subscription plan'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {codeType === 'quota' && (
                    <FormField
                      control={form.control}
                      name='quota_dollars'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{quotaLabel}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              step={quotaStep}
                              placeholder={quotaPlaceholder}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {tokensOnly
                              ? t('Enter the quota amount in tokens')
                              : t('Enter the quota amount in {{currency}}', {
                                  currency: currencyLabel,
                                })}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name='expired_time'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Expiration Time')}</FormLabel>
                        <div className='flex flex-col gap-2'>
                          <FormControl>
                            <DateTimePicker
                              value={field.value ?? undefined}
                              onChange={(date) => field.onChange(date ?? null)}
                              placeholder={t('Never expires')}
                            />
                          </FormControl>
                          <div className='grid grid-cols-4 gap-1.5 sm:flex sm:gap-2'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleSetExpiry(0, 0, 0)}
                            >
                              {t('Never')}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleSetExpiry(1, 0, 0)}
                            >
                              {t('1M')}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleSetExpiry(0, 7, 0)}
                            >
                              {t('1W')}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => handleSetExpiry(0, 1, 0)}
                            >
                              {t('1 Day')}
                            </Button>
                          </div>
                        </div>
                        <FormDescription>
                          {t('Leave empty for never expires')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isUpdate && (
                    <FormField
                      control={form.control}
                      name='count'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Quantity')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type='number'
                              min='1'
                              max='100'
                              placeholder={t('Number of codes to create')}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value, 10) || 1
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              'Create multiple redemption codes at once (1-100)'
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </SideDrawerSection>
              </fieldset>
            </form>
          </Form>
          <SheetFooter className={sideDrawerFooterClassName()}>
            <SheetClose render={<Button variant='outline' />}>
              {t('Close')}
            </SheetClose>
            <Button
              form='redemption-form'
              type='submit'
              disabled={isSubmitting || !isUpdateReady}
            >
              {submitButtonLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {createdCodes && (
        <RedemptionsExportDialog
          data={createdCodes}
          onClose={() => setCreatedCodes(null)}
        />
      )}
    </>
  )
}
