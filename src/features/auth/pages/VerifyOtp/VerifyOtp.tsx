import React, { useMemo, useState } from 'react';
import { Paper, TextInput, Button, Title, Text } from '@mantine/core';
import classes from '@/features/auth/pages/SignIn/SignIn.module.css';
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import useAuth from '@/features/auth/hooks/useAuth';

export default function VerifyOtp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { verifyOtp } = useAuth();

  const schema = useMemo(
    () =>
      yup.object().shape({
        code: yup
          .string()
          .required('کد ورود الزامی است')
          .matches(/^\d{5}$/, 'کد ورود باید ۵ رقم باشد'),
      }),
    []
  );

  const form = useForm({
    initialValues: {
      code: '',
    },
    validate: yupResolver(schema),
  });

  async function handleSubmit(values: { code: string }) {
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(values.code);
      if (res?.status === 'failed') {
        setError(res.message);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className={classes.wrapper}>
          <Paper className={classes.form} radius={0} p={30}>
            <Title order={2} className={classes.title} ta='center' mt='md' mb={50}>
              {'ورود با کد تایید'}
            </Title>
            {error ? (
              <Text c='red' ta='center' mb='md'>
                {error}
              </Text>
            ) : null}
            <TextInput
              {...form.getInputProps('code')}
              name={'code'}
              label={'کد ۵ رقمی'}
              withAsterisk
              placeholder='12345'
              size='md'
              inputMode='numeric'
              maxLength={5}
            />
            <Button loading={loading} type={'submit'} fullWidth mt='xl' size='md'>
              {'تایید'}
            </Button>
          </Paper>
        </div>
      </form>
    </div>
  );
}
