import React, { useMemo, useState } from 'react';
import { Paper, TextInput, Button, Title, Text } from '@mantine/core';
import classes from './SignIn.module.css';
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import useAuth from '@/features/auth/hooks/useAuth';
import { usePostLoginMutation } from '../../api/login';
import { useTranslation } from 'react-i18next';

export default function SignIn() {
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>('');
  const { signIn } = useAuth();
  const { isPending: loading, error, data } = usePostLoginMutation();
  const { t } = useTranslation();
  const schema = useMemo(
    () =>
      yup.object().shape({
        phone: yup.string().required('شماره همراه الزامی است'),
      }),
    []
  );

  const form = useForm({
    initialValues: {
      phone: '',
    },
    validate: yupResolver(schema),
  });

  async function handleSubmit(values: { phone: string }) {
    // setLoading(true);
    // setError('');
    try {
      const res = await signIn(values);
      // if (res?.status === 'failed') {
      //   setError(res.message);
      // }
    } catch (e) {
      // setError(String(e));
    } finally {
      // setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className={classes.wrapper}>
          <Paper className={classes.form} radius={0} p={30}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src='/logo/carmode.jpeg' alt='carmode' style={{ height: 64, width: 'auto' }} />
            </div>
            <Title order={2} className={classes.title} ta='center' mt='md' mb={50}>
              {t('auth.welcomeTitle')}
            </Title>
            <Text ta='center' mt='md' mb={50}>
              {t('auth.welcomeSubtitle')}{' '}
              <a href={'https://github.com/auronvila/mantine-template/wiki'}>مستندات</a>
            </Text>
            {error ? (
              <Text c='red' ta='center' mb='md'>
                {/* {error.message || error} */}
              </Text>
            ) : null}
            <TextInput
              {...form.getInputProps('phone')}
              name={'phone'}
              label={'شماره همراه'}
              withAsterisk
              placeholder='09xxxxxxxxx'
              size='md'
              inputMode='tel'
            />
            <Button loading={loading} type={'submit'} fullWidth mt='xl' size='md'>
              {'دریافت کد ورود'}
            </Button>
          </Paper>
        </div>
      </form>
    </div>
  );
}
