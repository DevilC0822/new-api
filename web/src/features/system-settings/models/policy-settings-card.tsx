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
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as z from 'zod'

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
import { Switch } from '@/components/ui/switch'

import {
  SettingsForm,
  SettingsSwitchContent,
  SettingsSwitchItem,
} from '../components/settings-form-layout'
import { SettingsPageFormActions } from '../components/settings-page-context'
import { SettingsSection } from '../components/settings-section'
import { useUpdateOption } from '../hooks/use-update-option'
import { safeNumberFieldProps } from '../utils/numeric-field'

/**
 * The schema uses a nested object so the dotted FormField `name` props line
 * up with react-hook-form's path semantics. Using flat keys like
 * `'policy.violation_fee_enabled'` causes RHF to silently maintain two
 * parallel value trees and saves never see the user input.
 */
const policySchema = z.object({
  policy: z.object({
    violation_fee_enabled: z.boolean(),
    violation_fee_usd: z.coerce.number().min(0),
    end_user_id_header_enabled: z.boolean(),
    auto_restrict_enabled: z.boolean(),
    violation_threshold: z.coerce.number().int().min(1),
    violation_window_minutes: z.coerce.number().int().min(1),
  }),
})

type PolicyFormInput = z.input<typeof policySchema>
type PolicyFormValues = z.output<typeof policySchema>

type FlatPolicyDefaults = {
  'policy.violation_fee_enabled': boolean
  'policy.violation_fee_usd': number
  'policy.end_user_id_header_enabled': boolean
  'policy.auto_restrict_enabled': boolean
  'policy.violation_threshold': number
  'policy.violation_window_minutes': number
}

const buildFormDefaults = (defaults: FlatPolicyDefaults): PolicyFormInput => ({
  policy: {
    violation_fee_enabled: defaults['policy.violation_fee_enabled'],
    violation_fee_usd: defaults['policy.violation_fee_usd'],
    end_user_id_header_enabled:
      defaults['policy.end_user_id_header_enabled'],
    auto_restrict_enabled: defaults['policy.auto_restrict_enabled'],
    violation_threshold: defaults['policy.violation_threshold'],
    violation_window_minutes: defaults['policy.violation_window_minutes'],
  },
})

const normalizeFormValues = (values: PolicyFormValues): FlatPolicyDefaults => ({
  'policy.violation_fee_enabled': values.policy.violation_fee_enabled,
  'policy.violation_fee_usd': values.policy.violation_fee_usd,
  'policy.end_user_id_header_enabled':
    values.policy.end_user_id_header_enabled,
  'policy.auto_restrict_enabled': values.policy.auto_restrict_enabled,
  'policy.violation_threshold': values.policy.violation_threshold,
  'policy.violation_window_minutes': values.policy.violation_window_minutes,
})

interface Props {
  defaultValues: FlatPolicyDefaults
}

export function PolicySettingsCard(props: Props) {
  const { t } = useTranslation()
  const updateOption = useUpdateOption()

  const formDefaults = useMemo(
    () => buildFormDefaults(props.defaultValues),
    [props.defaultValues]
  )

  const form = useForm<PolicyFormInput, unknown, PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: formDefaults,
  })

  const baselineRef = useRef<FlatPolicyDefaults>(props.defaultValues)
  const baselineSerializedRef = useRef<string>(
    JSON.stringify(props.defaultValues)
  )

  useEffect(() => {
    const serialized = JSON.stringify(props.defaultValues)
    if (serialized === baselineSerializedRef.current) return
    baselineRef.current = props.defaultValues
    baselineSerializedRef.current = serialized
    form.reset(buildFormDefaults(props.defaultValues))
  }, [props.defaultValues, form])

  const onSubmit = async (values: PolicyFormValues) => {
    const normalized = normalizeFormValues(values)
    const changedKeys = (
      Object.keys(normalized) as Array<keyof FlatPolicyDefaults>
    ).filter((key) => normalized[key] !== baselineRef.current[key])

    if (changedKeys.length === 0) {
      toast.info(t('No changes to save'))
      return
    }

    for (const key of changedKeys) {
      await updateOption.mutateAsync({
        key,
        value: normalized[key],
      })
    }

    baselineRef.current = normalized
    baselineSerializedRef.current = JSON.stringify(normalized)
    form.reset(buildFormDefaults(normalized))
  }

  const feeEnabled = form.watch('policy.violation_fee_enabled')
  const restrictEnabled = form.watch('policy.auto_restrict_enabled')

  return (
    <SettingsSection title={t('Upstream Policy Violation')}>
      <Form {...form}>
        <SettingsForm onSubmit={form.handleSubmit(onSubmit)}>
          <SettingsPageFormActions
            onSave={form.handleSubmit(onSubmit)}
            isSaving={updateOption.isPending}
          />
          <FormField
            control={form.control}
            name='policy.violation_fee_enabled'
            render={({ field }) => (
              <SettingsSwitchItem>
                <SettingsSwitchContent>
                  <FormLabel>
                    {t('Charge the upstream violation fee')}
                  </FormLabel>
                  <FormDescription>
                    {t(
                      'When the upstream rejects a request for a policy violation (moderation codes, content_filter / refusal responses), the platform charges a per-request fee. Enable to pass this fee on to the offending user.'
                    )}
                  </FormDescription>
                </SettingsSwitchContent>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </SettingsSwitchItem>
            )}
          />

          <FormField
            control={form.control}
            name='policy.violation_fee_usd'
            render={({ field }) => (
              <FormItem className='max-w-xs'>
                <FormLabel>{t('Violation fee (USD)')}</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step={0.01}
                    min={0}
                    {...safeNumberFieldProps(field)}
                    disabled={!feeEnabled}
                  />
                </FormControl>
                <FormDescription>
                  {t(
                    'Charged at full price regardless of group ratio, matching what the upstream bills the site.'
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='policy.end_user_id_header_enabled'
            render={({ field }) => (
              <SettingsSwitchItem>
                <SettingsSwitchContent>
                  <FormLabel>{t('Send end-user identifier header')}</FormLabel>
                  <FormDescription>
                    {t(
                      'Tags each upstream request with a pseudonymous per-user identifier so the platform restricts only the offending user instead of the whole site key.'
                    )}
                  </FormDescription>
                </SettingsSwitchContent>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </SettingsSwitchItem>
            )}
          />

          <FormField
            control={form.control}
            name='policy.auto_restrict_enabled'
            render={({ field }) => (
              <SettingsSwitchItem>
                <SettingsSwitchContent>
                  <FormLabel>{t('Auto-restrict violating users')}</FormLabel>
                  <FormDescription>
                    {t(
                      'Automatically disables a user account when their policy violations reach the threshold within the window, before the upstream escalates to account-wide restrictions.'
                    )}
                  </FormDescription>
                </SettingsSwitchContent>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </SettingsSwitchItem>
            )}
          />

          <FormField
            control={form.control}
            name='policy.violation_threshold'
            render={({ field }) => (
              <FormItem className='max-w-xs'>
                <FormLabel>{t('Violation threshold')}</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    step={1}
                    {...safeNumberFieldProps(field)}
                    disabled={!restrictEnabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='policy.violation_window_minutes'
            render={({ field }) => (
              <FormItem className='max-w-xs'>
                <FormLabel>{t('Violation window (minutes)')}</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    step={1}
                    {...safeNumberFieldProps(field)}
                    disabled={!restrictEnabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsForm>
      </Form>
    </SettingsSection>
  )
}
