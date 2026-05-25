import React, { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text } from '@mantine/core';
import classes from './SignIn.module.css';
import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import useAuth from '@/utils/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const schema = yup.object().shape({
    email: yup.string().required(t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: yup.string().required(t('validation.passwordRequired')),
  });

  const form = useForm({
    initialValues: {
      email: 'admin@test.com',
      password: '12345qwerty',
    },
    validate: yupResolver(schema),
  });

  async function handleSubmit(values: { email: string; password: string }) {
    setLoading(true);
    try {
      const res = await signIn(values);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
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
            <TextInput
              {...form.getInputProps('email')}
              name={'email'}
              label={t('auth.emailLabel')}
              withAsterisk
              placeholder='hello@gmail.com'
              size='md'
            />
            <PasswordInput
              {...form.getInputProps('password')}
              name={'password'}
              label={t('auth.passwordLabel')}
              placeholder={t('auth.passwordLabel')}
              mt='md'
              size='md'
            />
            <Button loading={loading} type={'submit'} fullWidth mt='xl' size='md'>
              {t('auth.login')}
            </Button>
            {/*<Text ta="center" mt="md">*/}
            {/*  Don&apos;t have an account?{' '}*/}
            {/*  <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>*/}
            {/*    Register*/}
            {/*  </Anchor>*/}
            {/*</Text>*/}
          </Paper>
        </div>
      </form>
    </div>
  );
}
